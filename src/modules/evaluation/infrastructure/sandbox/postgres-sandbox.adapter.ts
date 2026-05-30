import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { ExerciseTable } from '../../../exercises/domain/entities/exercise';
import { SqlExecutorPort } from '../../domain/ports/sql-executor.port';
import { EvaluationResult, QueryResult } from '../../domain/value-objects/evaluation-result.vo';

@Injectable()
export class PostgresSandboxAdapter extends SqlExecutorPort {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super();
  }

  async execute(
    tables: ExerciseTable[],
    userQuery: string,
    expectedQuery: string,
    orderMatters: boolean,
  ): Promise<EvaluationResult> {
    const schemaName = `sandbox_${randomUUID().replaceAll('-', '')}`;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query(`CREATE SCHEMA "${schemaName}"`);
      await queryRunner.query(`SET search_path TO "${schemaName}"`);

      const sorted = [...tables].sort((a, b) => a.displayOrder - b.displayOrder);
      for (const table of sorted) {
        await queryRunner.query(table.createStatement);
        await queryRunner.query(table.insertStatement);
      }

      const expectedRaw: Record<string, unknown>[] = await queryRunner.query(expectedQuery);
      const expectedResult = this.toQueryResult(expectedRaw);

      await queryRunner.query(`GRANT USAGE ON SCHEMA "${schemaName}" TO sandbox_user`);
      await queryRunner.query(`GRANT SELECT ON ALL TABLES IN SCHEMA "${schemaName}" TO sandbox_user`);

      let userResult: QueryResult | null = null;
      let executionError: string | null = null;

      try {
        await queryRunner.query('SET ROLE sandbox_user');
        const userRaw: Record<string, unknown>[] = await queryRunner.query(userQuery);
        userResult = this.toQueryResult(userRaw);
      } catch (err: unknown) {
        executionError = err instanceof Error ? err.message : 'Unknown error';
      } finally {
        await queryRunner.query('RESET ROLE').catch(() => {});
      }

      if (executionError !== null) return EvaluationResult.executionFailed(executionError);

      const correct = this.compareResults(userResult!, expectedResult, orderMatters);
      return correct
        ? EvaluationResult.success(userResult!, expectedResult)
        : EvaluationResult.wrongResult(userResult!, expectedResult);
    } finally {
      await queryRunner.query('RESET ROLE').catch(() => {});
      await queryRunner.query('RESET search_path').catch(() => {});
      await queryRunner.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => {});
      await queryRunner.release();
    }
  }

  private toQueryResult(rows: Record<string, unknown>[]): QueryResult {
    if (!rows || rows.length === 0) return { columns: [], rows: [] };
    const columns = Object.keys(rows[0]);
    return { columns, rows: rows.map((row) => columns.map((col) => row[col])) };
  }

  private compareResults(user: QueryResult, expected: QueryResult, orderMatters: boolean): boolean {
    if (user.columns.length !== expected.columns.length) return false;
    if (user.rows.length !== expected.rows.length) return false;

    const userCols = [...user.columns].map((c) => c.toLowerCase()).sort((a, b) => a.localeCompare(b));
    const expectedCols = [...expected.columns].map((c) => c.toLowerCase()).sort((a, b) => a.localeCompare(b));
    if (!userCols.every((c, i) => c === expectedCols[i])) return false;

    const normalize = (row: unknown[]) => JSON.stringify(row.map((v) => String(v ?? '')));
    const userRows = user.rows.map(normalize);
    const expectedRows = expected.rows.map(normalize);

    if (orderMatters) {
      return userRows.every((r, i) => r === expectedRows[i]);
    }
    return [...userRows].sort().every((r, i) => r === [...expectedRows].sort()[i]);
  }
}

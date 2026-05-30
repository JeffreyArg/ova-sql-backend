import { Module } from '@nestjs/common';
import { ExercisesModule } from '../exercises/exercises.module';
import { SqlExecutorPort } from './domain/ports/sql-executor.port';
import { EvaluateSqlUseCase } from './application/use-cases/evaluate-sql.use-case';
import { PostgresSandboxAdapter } from './infrastructure/sandbox/postgres-sandbox.adapter';
import { EvaluationController } from './infrastructure/http/evaluation.controller';

@Module({
  imports: [ExercisesModule],
  controllers: [EvaluationController],
  providers: [
    { provide: SqlExecutorPort, useClass: PostgresSandboxAdapter },
    EvaluateSqlUseCase,
  ],
})
export class EvaluationModule {}

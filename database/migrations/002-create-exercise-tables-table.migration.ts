import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExerciseTablesTable1748044800002 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE exercise_tables (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
        table_name VARCHAR(100) NOT NULL,
        create_statement TEXT NOT NULL,
        insert_statement TEXT NOT NULL,
        display_order INT NOT NULL DEFAULT 0
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS exercise_tables`);
  }
}

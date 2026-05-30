import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExercisesTable1748044800001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE difficulty_enum AS ENUM ('easy', 'medium', 'hard')
    `);
    await queryRunner.query(`
      CREATE TABLE exercises (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        difficulty difficulty_enum NOT NULL,
        expected_query TEXT NOT NULL,
        hint TEXT,
        order_matters BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS exercises`);
    await queryRunner.query(`DROP TYPE IF EXISTS difficulty_enum`);
  }
}

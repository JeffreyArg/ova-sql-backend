import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSandboxRole1748044800003 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'sandbox_user') THEN
          CREATE ROLE sandbox_user NOLOGIN;
        END IF;
      END $$;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP ROLE IF EXISTS sandbox_user`);
  }
}

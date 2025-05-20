import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseEntity1747761280166 implements MigrationInterface {
    name = 'BaseEntity1747761280166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "submission"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "submission"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying(100) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "submission" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "submission" DROP COLUMN "created_at"
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Quiz1747749968203 implements MigrationInterface {
    name = 'Quiz1747749968203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz"
                RENAME COLUMN "score" TO "level"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP COLUMN "level"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD "level" integer NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP COLUMN "level"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD "level" double precision NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
                RENAME COLUMN "level" TO "score"
        `);
    }

}

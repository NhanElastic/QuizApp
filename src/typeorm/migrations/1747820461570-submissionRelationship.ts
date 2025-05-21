import { MigrationInterface, QueryRunner } from "typeorm";

export class SubmissionRelationship1747820461570 implements MigrationInterface {
    name = 'SubmissionRelationship1747820461570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "submission"
            ADD "quizId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "submission"
            ADD CONSTRAINT "FK_75eaee88453d5959dea555d14d6" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "submission" DROP CONSTRAINT "FK_75eaee88453d5959dea555d14d6"
        `);
        await queryRunner.query(`
            ALTER TABLE "submission" DROP COLUMN "quizId"
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinUserOnQuiz1747808621086 implements MigrationInterface {
    name = 'JoinUserOnQuiz1747808621086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD "userId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD CONSTRAINT "UQ_52c158a608620611799fd63a927" UNIQUE ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD CONSTRAINT "FK_52c158a608620611799fd63a927" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP CONSTRAINT "FK_52c158a608620611799fd63a927"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP CONSTRAINT "UQ_52c158a608620611799fd63a927"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP COLUMN "userId"
        `);
    }

}

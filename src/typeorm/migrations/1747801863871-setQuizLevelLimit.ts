import { MigrationInterface, QueryRunner } from "typeorm";

export class SetQuizLevelLimit1747801863871 implements MigrationInterface {
    name = 'SetQuizLevelLimit1747801863871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD CONSTRAINT "CHK_30954c47e10cefbbb4df0282fb" CHECK (
                    "level" >= 0
                    AND "level" <= 3
                )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP CONSTRAINT "CHK_30954c47e10cefbbb4df0282fb"
        `);
    }

}

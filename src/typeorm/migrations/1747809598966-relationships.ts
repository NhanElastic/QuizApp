import { MigrationInterface, QueryRunner } from "typeorm";

export class Relationships1747809598966 implements MigrationInterface {
    name = 'Relationships1747809598966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP CONSTRAINT "FK_52c158a608620611799fd63a927"
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz" DROP CONSTRAINT "UQ_52c158a608620611799fd63a927"
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
            ALTER TABLE "quiz"
            ADD CONSTRAINT "UQ_52c158a608620611799fd63a927" UNIQUE ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "quiz"
            ADD CONSTRAINT "FK_52c158a608620611799fd63a927" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}

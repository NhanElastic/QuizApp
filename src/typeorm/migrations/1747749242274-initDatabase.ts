import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1747749242274 implements MigrationInterface {
    name = 'InitDatabase1747749242274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "submission" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "answer" text NOT NULL,
                "score" double precision NOT NULL DEFAULT '0',
                "userId" uuid,
                CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quiz" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(100) NOT NULL,
                "description" text NOT NULL,
                "question" text NOT NULL,
                "answer" text NOT NULL,
                "score" double precision NOT NULL DEFAULT '0',
                CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'teacher', 'student', 'guest')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(30) NOT NULL,
                "password" character varying(100) NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'guest',
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "submission"
            ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "quiz"
        `);
        await queryRunner.query(`
            DROP TABLE "submission"
        `);
    }

}

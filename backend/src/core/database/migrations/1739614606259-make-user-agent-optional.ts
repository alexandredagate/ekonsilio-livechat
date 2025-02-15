import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserAgentOptional1739614606259 implements MigrationInterface {
    name = 'MakeUserAgentOptional1739614606259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "userAgent" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "userAgent" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "userAgent" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "userAgent" SET NOT NULL`);
    }

}

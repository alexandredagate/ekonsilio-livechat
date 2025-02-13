import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConversationEntity1739463856947 implements MigrationInterface {
    name = 'CreateConversationEntity1739463856947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userAgent" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "conversation"`);
    }

}

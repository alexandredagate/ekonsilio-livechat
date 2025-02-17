import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActiveFieldOnConversation1739799110573 implements MigrationInterface {
    name = 'AddActiveFieldOnConversation1739799110573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ADD "active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "active"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOperatorToConversation1739635694082 implements MigrationInterface {
    name = 'AddOperatorToConversation1739635694082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" ADD "operatorId" uuid`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_b225cf0cc8086b99e29ad818163" FOREIGN KEY ("operatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_b225cf0cc8086b99e29ad818163"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "operatorId"`);
    }

}

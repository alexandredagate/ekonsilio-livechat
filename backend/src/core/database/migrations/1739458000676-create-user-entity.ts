import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserEntity1739458000676 implements MigrationInterface {
    name = 'CreateUserEntity1739458000676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`INSERT INTO "user" (username, password) VALUES ('genius0213', '$2a$12$j7A9pVnqd/fc8RdS5XojP.Gg03Ou9Oe98gXsWqOVP1qORbg2W1K6q')`);
        await queryRunner.query(`INSERT INTO "user" (username, password) VALUES ('genius0212', '$2a$12$j7A9pVnqd/fc8RdS5XojP.Gg03Ou9Oe98gXsWqOVP1qORbg2W1K6q')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

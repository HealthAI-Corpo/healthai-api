import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddZitadelIdToUtilisateur1781136000000 implements MigrationInterface {
  name = 'AddZitadelIdToUtilisateur1781136000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ADD "zitadel_id" character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ADD CONSTRAINT "UQ_utilisateur_zitadel_id" UNIQUE ("zitadel_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_utilisateur_zitadel_id" ON "utilisateur" ("zitadel_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "nom" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "prenom" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "date_de_naissance" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "genre" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "mot_de_passe_hash" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "mot_de_passe_hash" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "genre" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "date_de_naissance" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "prenom" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" ALTER COLUMN "nom" SET NOT NULL`,
    );
    await queryRunner.query(`DROP INDEX "IDX_utilisateur_zitadel_id"`);
    await queryRunner.query(
      `ALTER TABLE "utilisateur" DROP CONSTRAINT "UQ_utilisateur_zitadel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "utilisateur" DROP COLUMN "zitadel_id"`,
    );
  }
}

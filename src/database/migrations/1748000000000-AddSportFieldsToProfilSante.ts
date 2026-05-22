import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSportFieldsToProfilSante1748000000000
  implements MigrationInterface
{
  name = 'AddSportFieldsToProfilSante1748000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profil_sante" ADD "age" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" ADD "niveau_sportif" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" ADD "equipement_disponible" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" ADD "hr_rest" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" ADD "hr_max" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" ADD "hr_avg" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" ADD "body_fat_pct" numeric(5,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profil_sante" DROP COLUMN "body_fat_pct"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" DROP COLUMN "hr_avg"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" DROP COLUMN "hr_max"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" DROP COLUMN "hr_rest"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" DROP COLUMN "equipement_disponible"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" DROP COLUMN "niveau_sportif"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profil_sante" DROP COLUMN "age"`,
    );
  }
}

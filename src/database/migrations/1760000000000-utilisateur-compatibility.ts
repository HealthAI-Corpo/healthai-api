import { MigrationInterface, QueryRunner } from 'typeorm';

export class UtilisateurCompatibility1760000000000 implements MigrationInterface {
  name = 'UtilisateurCompatibility1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "utilisateur" ADD COLUMN IF NOT EXISTS "date_naissance" date',
    );
    await queryRunner.query(
      'ALTER TABLE "utilisateur" ADD COLUMN IF NOT EXISTS "taille_cm" integer',
    );
    await queryRunner.query(
      'ALTER TABLE "utilisateur" ADD COLUMN IF NOT EXISTS "mot_de_passe_hash" character varying(255)',
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'utilisateur'
            AND column_name = 'age'
        ) THEN
          UPDATE "utilisateur"
          SET "date_naissance" = (
            CURRENT_DATE - make_interval(years => GREATEST("age", 0))
          )::date
          WHERE "date_naissance" IS NULL
            AND "age" IS NOT NULL;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'utilisateur'
            AND column_name = 'taille'
        ) THEN
          UPDATE "utilisateur"
          SET "taille_cm" = GREATEST(ROUND("taille")::integer, 1)
          WHERE "taille_cm" IS NULL
            AND "taille" IS NOT NULL;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'utilisateur'
            AND column_name = 'mot_de_passe'
        ) THEN
          UPDATE "utilisateur"
          SET "mot_de_passe_hash" = "mot_de_passe"
          WHERE "mot_de_passe_hash" IS NULL
            AND "mot_de_passe" IS NOT NULL;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      UPDATE "utilisateur"
      SET "date_naissance" = DATE '1990-01-01'
      WHERE "date_naissance" IS NULL
    `);

    await queryRunner.query(`
      UPDATE "utilisateur"
      SET "taille_cm" = 170
      WHERE "taille_cm" IS NULL
    `);

    await queryRunner.query(`
      UPDATE "utilisateur"
      SET "mot_de_passe_hash" = 'legacy-password-not-set'
      WHERE "mot_de_passe_hash" IS NULL
    `);

    await queryRunner.query(
      'ALTER TABLE "utilisateur" ALTER COLUMN "date_naissance" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "utilisateur" ALTER COLUMN "taille_cm" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "utilisateur" ALTER COLUMN "mot_de_passe_hash" SET NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "utilisateur" DROP COLUMN IF EXISTS "mot_de_passe_hash"',
    );
    await queryRunner.query(
      'ALTER TABLE "utilisateur" DROP COLUMN IF EXISTS "taille_cm"',
    );
    await queryRunner.query(
      'ALTER TABLE "utilisateur" DROP COLUMN IF EXISTS "date_naissance"',
    );
  }
}

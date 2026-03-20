import { MigrationInterface, QueryRunner } from 'typeorm';

export class UtilisateurLegacyDefaults1760000001000 implements MigrationInterface {
  name = 'UtilisateurLegacyDefaults1760000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
          SET "age" = GREATEST(
            EXTRACT(YEAR FROM age(CURRENT_DATE, "date_naissance"))::integer,
            0
          )
          WHERE "age" IS NULL
            AND "date_naissance" IS NOT NULL;

          UPDATE "utilisateur"
          SET "age" = 0
          WHERE "age" IS NULL;

          ALTER TABLE "utilisateur" ALTER COLUMN "age" SET DEFAULT 0;
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
          SET "taille" = "taille_cm"
          WHERE "taille" IS NULL
            AND "taille_cm" IS NOT NULL;

          UPDATE "utilisateur"
          SET "taille" = 170
          WHERE "taille" IS NULL;

          ALTER TABLE "utilisateur" ALTER COLUMN "taille" SET DEFAULT 170;
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
          SET "mot_de_passe" = "mot_de_passe_hash"
          WHERE "mot_de_passe" IS NULL
            AND "mot_de_passe_hash" IS NOT NULL;

          UPDATE "utilisateur"
          SET "mot_de_passe" = 'legacy-password-not-set'
          WHERE "mot_de_passe" IS NULL;

          ALTER TABLE "utilisateur"
          ALTER COLUMN "mot_de_passe" SET DEFAULT 'legacy-password-not-set';
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
          ALTER TABLE "utilisateur" ALTER COLUMN "age" DROP DEFAULT;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'utilisateur'
            AND column_name = 'taille'
        ) THEN
          ALTER TABLE "utilisateur" ALTER COLUMN "taille" DROP DEFAULT;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'utilisateur'
            AND column_name = 'mot_de_passe'
        ) THEN
          ALTER TABLE "utilisateur" ALTER COLUMN "mot_de_passe" DROP DEFAULT;
        END IF;
      END
      $$;
    `);
  }
}

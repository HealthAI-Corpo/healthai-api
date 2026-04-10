import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignSchemaWithCanonicalSql1775813500000 implements MigrationInterface {
    name = 'AlignSchemaWithCanonicalSql1775813500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // log_aliment: restore canonical column names (reversed from mig1)
        await queryRunner.query(`DROP INDEX "public"."IDX_3be815109f4b41f86a65d6bc22"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" RENAME COLUMN "repas" TO "type_repas"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" RENAME COLUMN "quantite" TO "quantite_g"`);
        await queryRunner.query(`CREATE INDEX "IDX_log_aliment_type_repas" ON "log_aliment" ("type_repas")`);

        // exercice: extend muscles varchar from 100 to 200
        await queryRunner.query(`ALTER TABLE "exercice" ALTER COLUMN "muscles_principaux" TYPE character varying(200)`);
        await queryRunner.query(`ALTER TABLE "exercice" ALTER COLUMN "muscles_secondaires" TYPE character varying(200)`);

        // exercice: enforce NOT NULL on type_exercice
        await queryRunner.query(`ALTER TABLE "exercice" ALTER COLUMN "type_exercice" SET NOT NULL`);

        // dataset_historique_seance_exercice: rename consommation_eau_l -> consommation_eau_ml and fix precision
        await queryRunner.query(`ALTER TABLE "dataset_historique_seance_exercice" RENAME COLUMN "consommation_eau_l" TO "consommation_eau_ml"`);
        await queryRunner.query(`ALTER TABLE "dataset_historique_seance_exercice" ALTER COLUMN "consommation_eau_ml" TYPE numeric(7,2)`);

        // dataset_recommandations_regime: fix score_desequilibre_nutriment precision (4,2) -> (4,1)
        await queryRunner.query(`ALTER TABLE "dataset_recommandations_regime" ALTER COLUMN "score_desequilibre_nutriment" TYPE numeric(4,1)`);

        // aliment: enforce NOT NULL on calories, proteines, lipides, glucides, unite_mesure
        await queryRunner.query(`UPDATE "aliment" SET "calories" = 0 WHERE "calories" IS NULL`);
        await queryRunner.query(`UPDATE "aliment" SET "proteines" = 0 WHERE "proteines" IS NULL`);
        await queryRunner.query(`UPDATE "aliment" SET "lipides" = 0 WHERE "lipides" IS NULL`);
        await queryRunner.query(`UPDATE "aliment" SET "glucides" = 0 WHERE "glucides" IS NULL`);
        await queryRunner.query(`UPDATE "aliment" SET "unite_mesure" = '100g' WHERE "unite_mesure" IS NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "calories" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "proteines" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "lipides" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "glucides" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "unite_mesure" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "unite_mesure" SET DEFAULT '100g'`);

        // profil_sante: enforce NOT NULL on poids_kg and taille_cm
        await queryRunner.query(`UPDATE "profil_sante" SET "poids_kg" = 0 WHERE "poids_kg" IS NULL`);
        await queryRunner.query(`UPDATE "profil_sante" SET "taille_cm" = 0 WHERE "taille_cm" IS NULL`);
        await queryRunner.query(`ALTER TABLE "profil_sante" ALTER COLUMN "poids_kg" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profil_sante" ALTER COLUMN "taille_cm" SET NOT NULL`);

        // utilisateur: enforce NOT NULL on date_de_naissance and genre
        await queryRunner.query(`UPDATE "utilisateur" SET "date_de_naissance" = '1900-01-01' WHERE "date_de_naissance" IS NULL`);
        await queryRunner.query(`UPDATE "utilisateur" SET "genre" = 'non_specifie' WHERE "genre" IS NULL`);
        await queryRunner.query(`ALTER TABLE "utilisateur" ALTER COLUMN "date_de_naissance" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "utilisateur" ALTER COLUMN "genre" SET NOT NULL`);

        // log_seance: enforce NOT NULL on duree_minutes and calorie_brulee
        await queryRunner.query(`UPDATE "log_seance" SET "duree_minutes" = 0 WHERE "duree_minutes" IS NULL`);
        await queryRunner.query(`UPDATE "log_seance" SET "calorie_brulee" = 0 WHERE "calorie_brulee" IS NULL`);
        await queryRunner.query(`ALTER TABLE "log_seance" ALTER COLUMN "duree_minutes" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "log_seance" ALTER COLUMN "calorie_brulee" SET NOT NULL`);

        // log_sante: enforce NOT NULL on poids_kg and bpm_moyen_journee
        await queryRunner.query(`UPDATE "log_sante" SET "poids_kg" = 0 WHERE "poids_kg" IS NULL`);
        await queryRunner.query(`UPDATE "log_sante" SET "bpm_moyen_journee" = 0 WHERE "bpm_moyen_journee" IS NULL`);
        await queryRunner.query(`ALTER TABLE "log_sante" ALTER COLUMN "poids_kg" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "log_sante" ALTER COLUMN "bpm_moyen_journee" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert log_sante
        await queryRunner.query(`ALTER TABLE "log_sante" ALTER COLUMN "bpm_moyen_journee" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "log_sante" ALTER COLUMN "poids_kg" DROP NOT NULL`);

        // Revert log_seance
        await queryRunner.query(`ALTER TABLE "log_seance" ALTER COLUMN "calorie_brulee" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "log_seance" ALTER COLUMN "duree_minutes" DROP NOT NULL`);

        // Revert utilisateur
        await queryRunner.query(`ALTER TABLE "utilisateur" ALTER COLUMN "genre" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "utilisateur" ALTER COLUMN "date_de_naissance" DROP NOT NULL`);

        // Revert profil_sante
        await queryRunner.query(`ALTER TABLE "profil_sante" ALTER COLUMN "taille_cm" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profil_sante" ALTER COLUMN "poids_kg" DROP NOT NULL`);

        // Revert aliment
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "unite_mesure" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "unite_mesure" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "glucides" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "lipides" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "proteines" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aliment" ALTER COLUMN "calories" DROP NOT NULL`);

        // Revert dataset_recommandations_regime precision
        await queryRunner.query(`ALTER TABLE "dataset_recommandations_regime" ALTER COLUMN "score_desequilibre_nutriment" TYPE numeric(4,2)`);

        // Revert dataset_historique_seance_exercice
        await queryRunner.query(`ALTER TABLE "dataset_historique_seance_exercice" ALTER COLUMN "consommation_eau_ml" TYPE numeric(4,1)`);
        await queryRunner.query(`ALTER TABLE "dataset_historique_seance_exercice" RENAME COLUMN "consommation_eau_ml" TO "consommation_eau_l"`);

        // Revert exercice type_exercice nullable
        await queryRunner.query(`ALTER TABLE "exercice" ALTER COLUMN "type_exercice" DROP NOT NULL`);

        // Revert exercice muscles length
        await queryRunner.query(`ALTER TABLE "exercice" ALTER COLUMN "muscles_secondaires" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "exercice" ALTER COLUMN "muscles_principaux" TYPE character varying(100)`);

        // Revert log_aliment column names
        await queryRunner.query(`DROP INDEX "public"."IDX_log_aliment_type_repas"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" RENAME COLUMN "quantite_g" TO "quantite"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" RENAME COLUMN "type_repas" TO "repas"`);
        await queryRunner.query(`CREATE INDEX "IDX_3be815109f4b41f86a65d6bc22" ON "log_aliment" ("repas")`);
    }
}

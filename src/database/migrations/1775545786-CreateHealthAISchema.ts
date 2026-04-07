import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHealthAISchema1775545786 implements MigrationInterface {
  name = 'CreateHealthAISchema1775545786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========================================
    // 1. CRÉATION DES TABLES MÉTIER
    // ========================================

    // Table UTILISATEUR
    await queryRunner.query(`
      CREATE TABLE "utilisateur" (
        "id_utilisateur" SERIAL NOT NULL,
        "nom" VARCHAR(50) NOT NULL,
        "prenom" VARCHAR(50) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "date_de_naissance" DATE,
        "genre" VARCHAR(50),
        "type_abonnement" VARCHAR(50),
        "date_inscription" TIMESTAMP NOT NULL DEFAULT now(),
        "mot_de_passe_hash" VARCHAR(255) NOT NULL,
        CONSTRAINT "PK_utilisateur" PRIMARY KEY ("id_utilisateur"),
        CONSTRAINT "UQ_utilisateur_email" UNIQUE ("email")
      )
    `);

    // Table ALIMENT
    await queryRunner.query(`
      CREATE TABLE "aliment" (
        "id_aliment" SERIAL NOT NULL,
        "nom" VARCHAR(100) NOT NULL,
        "categorie" VARCHAR(100),
        "type_repas" VARCHAR(50),
        "calories" NUMERIC(6,1),
        "proteines" NUMERIC(4,1),
        "lipides" NUMERIC(4,1),
        "glucides" NUMERIC(4,1),
        "fibres" NUMERIC(5,2),
        "sucres" NUMERIC(5,2),
        "sodium_mg" NUMERIC(7,2),
        "cholesterol_mg" NUMERIC(7,2),
        "unite_mesure" VARCHAR(20),
        CONSTRAINT "PK_aliment" PRIMARY KEY ("id_aliment")
      )
    `);

    // Table EXERCICE
    await queryRunner.query(`
      CREATE TABLE "exercice" (
        "id_exercice" SERIAL NOT NULL,
        "nom" VARCHAR(150) NOT NULL,
        "type_exercice" VARCHAR(100),
        "muscle_cible" VARCHAR(100),
        "equipement" VARCHAR(100),
        "difficulte" VARCHAR(50),
        "instructions" TEXT,
        CONSTRAINT "PK_exercice" PRIMARY KEY ("id_exercice")
      )
    `);

    // Table LOG_ALIMENT
    await queryRunner.query(`
      CREATE TABLE "log_aliment" (
        "id_log_aliment" SERIAL NOT NULL,
        "log_date" TIMESTAMP NOT NULL,
        "type_repas" VARCHAR(50),
        "quantite_g" NUMERIC(7,2),
        "unite" VARCHAR(20),
        "id_utilisateur" INTEGER NOT NULL,
        "id_aliment" INTEGER NOT NULL,
        CONSTRAINT "PK_log_aliment" PRIMARY KEY ("id_log_aliment")
      )
    `);

    // Table LOG_SEANCE
    await queryRunner.query(`
      CREATE TABLE "log_seance" (
        "id_seance_log" SERIAL NOT NULL,
        "log_date" TIMESTAMP NOT NULL,
        "type_seance" VARCHAR(50),
        "duree_minutes" NUMERIC(5,1),
        "calorie_brulee" NUMERIC(6,1),
        "bpm_moyen" INTEGER,
        "id_utilisateur" INTEGER NOT NULL,
        "id_exercice" INTEGER NOT NULL,
        CONSTRAINT "PK_log_seance" PRIMARY KEY ("id_seance_log")
      )
    `);

    // Table LOG_SANTE
    await queryRunner.query(`
      CREATE TABLE "log_sante" (
        "id_log_sante" SERIAL NOT NULL,
        "date_log" TIMESTAMP NOT NULL,
        "poids_kg" NUMERIC(5,2),
        "pourcentage_gras" NUMERIC(4,1),
        "imc_actuel" NUMERIC(4,1),
        "bpm_moyen_journee" INTEGER,
        "bpm_repos" INTEGER,
        "nb_pas" INTEGER,
        "heures_sommeil" NUMERIC(4,2),
        "hydratation_litres" NUMERIC(4,2),
        "id_utilisateur" INTEGER NOT NULL,
        CONSTRAINT "PK_log_sante" PRIMARY KEY ("id_log_sante")
      )
    `);

    // Table PROFIL_SANTE
    await queryRunner.query(`
      CREATE TABLE "profil_sante" (
        "id_profil_sante" SERIAL NOT NULL,
        "poids_kg" NUMERIC(5,2),
        "taille_cm" INTEGER,
        "imc" NUMERIC(4,1),
        "niveau_activite" VARCHAR(100),
        "type_maladie" VARCHAR(255),
        "severite" VARCHAR(50),
        "restrictions_alimentaires" TEXT,
        "allergies" TEXT,
        "objectif_principal" VARCHAR(200),
        "experience_sportive" VARCHAR(100),
        "frequence_entrainement" INTEGER,
        "id_utilisateur" INTEGER NOT NULL,
        CONSTRAINT "PK_profil_sante" PRIMARY KEY ("id_profil_sante"),
        CONSTRAINT "UQ_profil_sante_utilisateur" UNIQUE ("id_utilisateur")
      )
    `);

    // ========================================
    // 2. CRÉATION DES TABLES DATASETS
    // ========================================

    // Table DATASET_RECOMMANDATIONS_REGIME
    await queryRunner.query(`
      CREATE TABLE "dataset_recommandations_regime" (
        "id_dataset_recommandations_regime" VARCHAR NOT NULL,
        "age" INTEGER,
        "sexe" VARCHAR,
        "poids_kg" NUMERIC(5,2),
        "taille_cm" INTEGER,
        "type_maladie" VARCHAR,
        "gravite" VARCHAR,
        "niveau_activite_physique" VARCHAR,
        "apport_calorique_journalier" INTEGER,
        "cholesterol_mg_dl" NUMERIC(6,2),
        "tension_arterielle_mmHg" NUMERIC(6,2),
        "glucose_mg_dl" NUMERIC(6,2),
        "restrictions_alimentaires" VARCHAR,
        "allergies" VARCHAR,
        "cuisine_preferee" VARCHAR,
        "heures_exercice_semaine" NUMERIC(4,2),
        "adherence_regime" NUMERIC(4,2),
        "score_desequilibre_nutriment" NUMERIC(4,2),
        "recommandation_regime" VARCHAR,
        CONSTRAINT "PK_dataset_recommandations_regime" PRIMARY KEY ("id_dataset_recommandations_regime")
      )
    `);

    // Table DATASET_HISTORIQUE_SEANCE_EXERCICE
    await queryRunner.query(`
      CREATE TABLE "dataset_historique_seance_exercice" (
        "id_dataset_historique_seance_exercice" INTEGER NOT NULL,
        "age" INTEGER,
        "sexe" VARCHAR,
        "poids_kg" NUMERIC(5,2),
        "taille_cm" INTEGER,
        "bpm_max" INTEGER,
        "bpm_moyen" INTEGER,
        "bpm_repos" INTEGER,
        "duree_seance_minutes" NUMERIC(5,1),
        "calories_brulees" NUMERIC(6,1),
        "type_sport" VARCHAR,
        "pourcentage_gras" NUMERIC(4,1),
        "consommation_eau_l" NUMERIC(4,1),
        "frequence_sport_jour_semaine" INTEGER,
        "niveau_experience" INTEGER,
        CONSTRAINT "PK_dataset_historique_seance_exercice" PRIMARY KEY ("id_dataset_historique_seance_exercice")
      )
    `);

    // ========================================
    // 3. CRÉATION DES INDEX
    // ========================================

    // Index sur utilisateur
    await queryRunner.query(`
      CREATE INDEX "IDX_utilisateur_email" ON "utilisateur" ("email")
    `);

    // Index sur aliment
    await queryRunner.query(`
      CREATE INDEX "IDX_aliment_type_repas" ON "aliment" ("type_repas")
    `);

    // Index sur exercice
    await queryRunner.query(`
      CREATE INDEX "IDX_exercice_type_exercice" ON "exercice" ("type_exercice")
    `);

    // Index sur log_aliment
    await queryRunner.query(`
      CREATE INDEX "IDX_log_aliment_log_date" ON "log_aliment" ("log_date")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_log_aliment_type_repas" ON "log_aliment" ("type_repas")
    `);

    // Index sur log_seance
    await queryRunner.query(`
      CREATE INDEX "IDX_log_seance_log_date" ON "log_seance" ("log_date")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_log_seance_type_seance" ON "log_seance" ("type_seance")
    `);

    // Index sur log_sante
    await queryRunner.query(`
      CREATE INDEX "IDX_log_sante_date_log" ON "log_sante" ("date_log")
    `);

    // Index sur profil_sante
    await queryRunner.query(`
      CREATE INDEX "IDX_profil_sante_type_maladie" ON "profil_sante" ("type_maladie")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_profil_sante_id_utilisateur" ON "profil_sante" ("id_utilisateur")
    `);

    // Index sur dataset_recommandations_regime
    await queryRunner.query(`
      CREATE INDEX "IDX_dataset_recommandations_regime_type_maladie" ON "dataset_recommandations_regime" ("type_maladie")
    `);

    // Index sur dataset_historique_seance_exercice
    await queryRunner.query(`
      CREATE INDEX "IDX_dataset_historique_seance_exercice_type_sport" ON "dataset_historique_seance_exercice" ("type_sport")
    `);

    // ========================================
    // 4. CRÉATION DES FOREIGN KEYS
    // ========================================

    // Foreign keys pour log_aliment
    await queryRunner.query(`
      ALTER TABLE "log_aliment"
      ADD CONSTRAINT "FK_log_aliment_utilisateur"
      FOREIGN KEY ("id_utilisateur")
      REFERENCES "utilisateur"("id_utilisateur")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "log_aliment"
      ADD CONSTRAINT "FK_log_aliment_aliment"
      FOREIGN KEY ("id_aliment")
      REFERENCES "aliment"("id_aliment")
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
    `);

    // Foreign keys pour log_seance
    await queryRunner.query(`
      ALTER TABLE "log_seance"
      ADD CONSTRAINT "FK_log_seance_utilisateur"
      FOREIGN KEY ("id_utilisateur")
      REFERENCES "utilisateur"("id_utilisateur")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "log_seance"
      ADD CONSTRAINT "FK_log_seance_exercice"
      FOREIGN KEY ("id_exercice")
      REFERENCES "exercice"("id_exercice")
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
    `);

    // Foreign key pour log_sante
    await queryRunner.query(`
      ALTER TABLE "log_sante"
      ADD CONSTRAINT "FK_log_sante_utilisateur"
      FOREIGN KEY ("id_utilisateur")
      REFERENCES "utilisateur"("id_utilisateur")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Foreign key pour profil_sante
    await queryRunner.query(`
      ALTER TABLE "profil_sante"
      ADD CONSTRAINT "FK_profil_sante_utilisateur"
      FOREIGN KEY ("id_utilisateur")
      REFERENCES "utilisateur"("id_utilisateur")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ========================================
    // 1. SUPPRESSION DES FOREIGN KEYS
    // ========================================

    await queryRunner.query(`
      ALTER TABLE "profil_sante" DROP CONSTRAINT "FK_profil_sante_utilisateur"
    `);

    await queryRunner.query(`
      ALTER TABLE "log_sante" DROP CONSTRAINT "FK_log_sante_utilisateur"
    `);

    await queryRunner.query(`
      ALTER TABLE "log_seance" DROP CONSTRAINT "FK_log_seance_exercice"
    `);

    await queryRunner.query(`
      ALTER TABLE "log_seance" DROP CONSTRAINT "FK_log_seance_utilisateur"
    `);

    await queryRunner.query(`
      ALTER TABLE "log_aliment" DROP CONSTRAINT "FK_log_aliment_aliment"
    `);

    await queryRunner.query(`
      ALTER TABLE "log_aliment" DROP CONSTRAINT "FK_log_aliment_utilisateur"
    `);

    // ========================================
    // 2. SUPPRESSION DES INDEX
    // ========================================

    await queryRunner.query(`
      DROP INDEX "IDX_dataset_historique_seance_exercice_type_sport"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_dataset_recommandations_regime_type_maladie"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_profil_sante_id_utilisateur"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_profil_sante_type_maladie"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_log_sante_date_log"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_log_seance_type_seance"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_log_seance_log_date"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_log_aliment_type_repas"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_log_aliment_log_date"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_exercice_type_exercice"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_aliment_type_repas"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_utilisateur_email"
    `);

    // ========================================
    // 3. SUPPRESSION DES TABLES
    // ========================================

    await queryRunner.query(`DROP TABLE "dataset_historique_seance_exercice"`);
    await queryRunner.query(`DROP TABLE "dataset_recommandations_regime"`);
    await queryRunner.query(`DROP TABLE "profil_sante"`);
    await queryRunner.query(`DROP TABLE "log_sante"`);
    await queryRunner.query(`DROP TABLE "log_seance"`);
    await queryRunner.query(`DROP TABLE "log_aliment"`);
    await queryRunner.query(`DROP TABLE "exercice"`);
    await queryRunner.query(`DROP TABLE "aliment"`);
    await queryRunner.query(`DROP TABLE "utilisateur"`);
  }
}

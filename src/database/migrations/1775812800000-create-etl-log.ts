import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEtlLogTable1775812800000 implements MigrationInterface {
    name = 'CreateEtlLogTable1775812800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."etl_log_statut_enum" AS ENUM(
                'PENDING',
                'SUCCESS',
                'PARTIAL_FAILURE',
                'FAILURE'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "etl_log" (
                "id_etl_log"         SERIAL PRIMARY KEY,
                "libelle_pipeline"   character varying(255) NOT NULL,
                "fichier_nom"        character varying(255) NOT NULL,
                "date_execution"     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "nb_lignes_total"    integer,
                "nb_lignes_valides"  integer,
                "nb_lignes_anomalies" integer,
                "statut"             "public"."etl_log_statut_enum",
                "message"            text
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "etl_log"`);
        await queryRunner.query(`DROP TYPE "public"."etl_log_statut_enum"`);
    }
}

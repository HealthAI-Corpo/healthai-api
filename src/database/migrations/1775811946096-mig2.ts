import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityFieldsAndPrecision1775811946096 implements MigrationInterface {
    name = 'UpdateEntityFieldsAndPrecision1775811946096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // exercice: rename musclePrincipal -> muscles_principaux and muscleSecondaire -> muscles_secondaires
        await queryRunner.query(`ALTER TABLE "exercice" RENAME COLUMN "musclePrincipal" TO "muscles_principaux"`);
        await queryRunner.query(`ALTER TABLE "exercice" RENAME COLUMN "muscleSecondaire" TO "muscles_secondaires"`);

        // aliment: add eau_ml column
        await queryRunner.query(`ALTER TABLE "aliment" ADD "eau_ml" numeric(7,2)`);

        // dataset_recommandations_regime: increase adherence_regime precision from (4,2) to (5,2)
        await queryRunner.query(`ALTER TABLE "dataset_recommandations_regime" ALTER COLUMN "adherence_regime" TYPE numeric(5,2)`);

        // dataset_historique_seance_exercice: increase pourcentage_gras precision from (4,1) to (5,1)
        await queryRunner.query(`ALTER TABLE "dataset_historique_seance_exercice" ALTER COLUMN "pourcentage_gras" TYPE numeric(5,1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert pourcentage_gras precision
        await queryRunner.query(`ALTER TABLE "dataset_historique_seance_exercice" ALTER COLUMN "pourcentage_gras" TYPE numeric(4,1)`);

        // Revert adherence_regime precision
        await queryRunner.query(`ALTER TABLE "dataset_recommandations_regime" ALTER COLUMN "adherence_regime" TYPE numeric(4,2)`);

        // Remove eau_ml column
        await queryRunner.query(`ALTER TABLE "aliment" DROP COLUMN "eau_ml"`);

        // Revert exercice column renames
        await queryRunner.query(`ALTER TABLE "exercice" RENAME COLUMN "muscles_secondaires" TO "muscleSecondaire"`);
        await queryRunner.query(`ALTER TABLE "exercice" RENAME COLUMN "muscles_principaux" TO "musclePrincipal"`);
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class NomDeTaMigration1775722679787 implements MigrationInterface {
    name = 'NomDeTaMigration1775722679787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP CONSTRAINT "FK_log_aliment_utilisateur"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP CONSTRAINT "FK_log_aliment_aliment"`);
        await queryRunner.query(`ALTER TABLE "log_seance" DROP CONSTRAINT "FK_log_seance_utilisateur"`);
        await queryRunner.query(`ALTER TABLE "log_seance" DROP CONSTRAINT "FK_log_seance_exercice"`);
        await queryRunner.query(`ALTER TABLE "log_sante" DROP CONSTRAINT "FK_log_sante_utilisateur"`);
        await queryRunner.query(`ALTER TABLE "profil_sante" DROP CONSTRAINT "FK_profil_sante_utilisateur"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aliment_type_repas"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_log_aliment_log_date"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_log_aliment_type_repas"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_exercice_type_exercice"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_log_seance_log_date"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_log_seance_type_seance"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_log_sante_date_log"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_profil_sante_type_maladie"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_profil_sante_id_utilisateur"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_utilisateur_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dataset_recommandations_regime_type_maladie"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dataset_historique_seance_exercice_type_sport"`);
        await queryRunner.query(`ALTER TABLE "profil_sante" RENAME COLUMN "id_profil_sante" TO "id_profil"`);
        await queryRunner.query(`ALTER SEQUENCE "profil_sante_id_profil_sante_seq" RENAME TO "profil_sante_id_profil_seq"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP COLUMN "type_repas"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP COLUMN "quantite_g"`);
        await queryRunner.query(`ALTER TABLE "exercice" DROP COLUMN "muscle_cible"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD "repas" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD "quantite" numeric(7,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercice" ADD "musclePrincipal" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "exercice" ADD "muscleSecondaire" character varying(100)`);
        await queryRunner.query(`CREATE INDEX "IDX_68bbb43936f17f2433df554c40" ON "aliment" ("type_repas") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b985893a77f346147b6756858" ON "log_aliment" ("log_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_3be815109f4b41f86a65d6bc22" ON "log_aliment" ("repas") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f0b8ae5449507f57e08c08e67" ON "exercice" ("type_exercice") `);
        await queryRunner.query(`CREATE INDEX "IDX_42707f015386d7c91c6f659e5f" ON "log_seance" ("log_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b91eba7ddfd281d7ebe7eb616" ON "log_seance" ("type_seance") `);
        await queryRunner.query(`CREATE INDEX "IDX_2dbd7fa549d534cb1fe70a82a9" ON "log_sante" ("date_log") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b1e082c549570371de80ebb1a" ON "profil_sante" ("type_maladie") `);
        await queryRunner.query(`CREATE INDEX "IDX_b13a92a9a8ec2d26ea60378e5e" ON "profil_sante" ("id_utilisateur") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1136325a6b28e2a02b81b2f5e" ON "utilisateur" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_fb8d7982cecac5b0d5d33e06ec" ON "dataset_recommandations_regime" ("type_maladie") `);
        await queryRunner.query(`CREATE INDEX "IDX_f943b88065a0634b895c067b83" ON "dataset_historique_seance_exercice" ("type_sport") `);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD CONSTRAINT "FK_bedcf8cf70f4a8fc21085220ecc" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD CONSTRAINT "FK_0397e35615acee8fb530b73cecd" FOREIGN KEY ("id_aliment") REFERENCES "aliment"("id_aliment") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_seance" ADD CONSTRAINT "FK_32063e3c7f663786a52b3d550fe" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_seance" ADD CONSTRAINT "FK_3ba207f2956c2901ff31956b7bc" FOREIGN KEY ("id_exercice") REFERENCES "exercice"("id_exercice") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_sante" ADD CONSTRAINT "FK_fd5372d632a05a1c3b9521835c0" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profil_sante" ADD CONSTRAINT "FK_b13a92a9a8ec2d26ea60378e5e5" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profil_sante" DROP CONSTRAINT "FK_b13a92a9a8ec2d26ea60378e5e5"`);
        await queryRunner.query(`ALTER TABLE "log_sante" DROP CONSTRAINT "FK_fd5372d632a05a1c3b9521835c0"`);
        await queryRunner.query(`ALTER TABLE "log_seance" DROP CONSTRAINT "FK_3ba207f2956c2901ff31956b7bc"`);
        await queryRunner.query(`ALTER TABLE "log_seance" DROP CONSTRAINT "FK_32063e3c7f663786a52b3d550fe"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP CONSTRAINT "FK_0397e35615acee8fb530b73cecd"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP CONSTRAINT "FK_bedcf8cf70f4a8fc21085220ecc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f943b88065a0634b895c067b83"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb8d7982cecac5b0d5d33e06ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1136325a6b28e2a02b81b2f5e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b13a92a9a8ec2d26ea60378e5e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b1e082c549570371de80ebb1a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2dbd7fa549d534cb1fe70a82a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b91eba7ddfd281d7ebe7eb616"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_42707f015386d7c91c6f659e5f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f0b8ae5449507f57e08c08e67"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3be815109f4b41f86a65d6bc22"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b985893a77f346147b6756858"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68bbb43936f17f2433df554c40"`);
        await queryRunner.query(`ALTER TABLE "exercice" DROP COLUMN "muscleSecondaire"`);
        await queryRunner.query(`ALTER TABLE "exercice" DROP COLUMN "musclePrincipal"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP COLUMN "quantite"`);
        await queryRunner.query(`ALTER TABLE "log_aliment" DROP COLUMN "repas"`);
        await queryRunner.query(`ALTER TABLE "exercice" ADD "muscle_cible" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD "quantite_g" numeric(7,2)`);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD "type_repas" character varying(50)`);
        await queryRunner.query(`ALTER SEQUENCE "profil_sante_id_profil_seq" RENAME TO "profil_sante_id_profil_sante_seq"`);
        await queryRunner.query(`ALTER TABLE "profil_sante" RENAME COLUMN "id_profil" TO "id_profil_sante"`);
        await queryRunner.query(`CREATE INDEX "IDX_dataset_historique_seance_exercice_type_sport" ON "dataset_historique_seance_exercice" ("type_sport") `);
        await queryRunner.query(`CREATE INDEX "IDX_dataset_recommandations_regime_type_maladie" ON "dataset_recommandations_regime" ("type_maladie") `);
        await queryRunner.query(`CREATE INDEX "IDX_utilisateur_email" ON "utilisateur" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_profil_sante_id_utilisateur" ON "profil_sante" ("id_utilisateur") `);
        await queryRunner.query(`CREATE INDEX "IDX_profil_sante_type_maladie" ON "profil_sante" ("type_maladie") `);
        await queryRunner.query(`CREATE INDEX "IDX_log_sante_date_log" ON "log_sante" ("date_log") `);
        await queryRunner.query(`CREATE INDEX "IDX_log_seance_type_seance" ON "log_seance" ("type_seance") `);
        await queryRunner.query(`CREATE INDEX "IDX_log_seance_log_date" ON "log_seance" ("log_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_exercice_type_exercice" ON "exercice" ("type_exercice") `);
        await queryRunner.query(`CREATE INDEX "IDX_log_aliment_type_repas" ON "log_aliment" ("type_repas") `);
        await queryRunner.query(`CREATE INDEX "IDX_log_aliment_log_date" ON "log_aliment" ("log_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_aliment_type_repas" ON "aliment" ("type_repas") `);
        await queryRunner.query(`ALTER TABLE "profil_sante" ADD CONSTRAINT "FK_profil_sante_utilisateur" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_sante" ADD CONSTRAINT "FK_log_sante_utilisateur" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_seance" ADD CONSTRAINT "FK_log_seance_exercice" FOREIGN KEY ("id_exercice") REFERENCES "exercice"("id_exercice") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_seance" ADD CONSTRAINT "FK_log_seance_utilisateur" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD CONSTRAINT "FK_log_aliment_aliment" FOREIGN KEY ("id_aliment") REFERENCES "aliment"("id_aliment") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_aliment" ADD CONSTRAINT "FK_log_aliment_utilisateur" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

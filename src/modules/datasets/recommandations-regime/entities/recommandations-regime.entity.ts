import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('dataset_recommandations_regime')
export class RecommandationsRegime {
  @PrimaryColumn({ type: 'varchar', name: 'id_dataset_recommandations_regime' })
  idDatasetRecommandationsRegime: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', nullable: true })
  sexe: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'poids_kg',
  })
  poidsKg: number;

  @Column({ type: 'int', nullable: true, name: 'taille_cm' })
  tailleCm: number;

  @Column({ type: 'varchar', nullable: true, name: 'type_maladie' })
  @Index()
  typeMaladie: string;

  @Column({ type: 'varchar', nullable: true })
  gravite: string;

  @Column({ type: 'varchar', nullable: true, name: 'niveau_activite_physique' })
  niveauActivitePhysique: string;

  @Column({ type: 'int', nullable: true, name: 'apport_calorique_journalier' })
  apportCaloriqueJournalier: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    name: 'cholesterol_mg_dl',
  })
  cholesterolMgDl: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    name: 'tension_arterielle_mmHg',
  })
  tensionArterielleMMHg: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    name: 'glucose_mg_dl',
  })
  glucoseMgDl: number;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'restrictions_alimentaires',
  })
  restrictionsAlimentaires: string;

  @Column({ type: 'varchar', nullable: true })
  allergies: string;

  @Column({ type: 'varchar', nullable: true, name: 'cuisine_preferee' })
  cuisinePreferee: string;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    name: 'heures_exercice_semaine',
  })
  heuresExerciceSemaine: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'adherence_regime',
  })
  adherenceRegime: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    name: 'score_desequilibre_nutriment',
  })
  scoreDesequilibreNutriment: number;

  @Column({ type: 'varchar', nullable: true, name: 'recommandation_regime' })
  recommandationRegime: string;
}

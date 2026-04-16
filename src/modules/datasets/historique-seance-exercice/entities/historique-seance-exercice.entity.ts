import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('dataset_historique_seance_exercice')
export class HistoriqueSeanceExercice {
  @PrimaryGeneratedColumn({ name: 'id_dataset_historique_seance_exercice' })
  idDatasetHistoriqueSeanceExercice: number;

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

  @Column({ type: 'int', nullable: true, name: 'bpm_max' })
  bpmMax: number;

  @Column({ type: 'int', nullable: true, name: 'bpm_moyen' })
  bpmMoyen: number;

  @Column({ type: 'int', nullable: true, name: 'bpm_repos' })
  bpmRepos: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
    name: 'duree_seance_minutes',
  })
  dureeSeanceMinutes: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 1,
    nullable: true,
    name: 'calories_brulees',
  })
  caloriesBrulees: number;

  @Column({ type: 'varchar', nullable: true, name: 'type_sport' })
  @Index()
  typeSport: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
    name: 'pourcentage_gras',
  })
  pourcentageGras: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    name: 'consommation_eau_ml',
  })
  consommationEauMl: number;

  @Column({ type: 'int', nullable: true, name: 'frequence_sport_jour_semaine' })
  frequenceSportJourSemaine: number;

  @Column({ type: 'int', nullable: true, name: 'niveau_experience' })
  niveauExperience: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity('log_sante')
export class LogSante {
  @PrimaryGeneratedColumn({ name: 'id_log_sante' })
  idLogSante: number;

  @Column({ type: 'timestamp', nullable: false, name: 'date_log' })
  @Index()
  dateLog: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'poids_kg' })
  poidsKg: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, name: 'pourcentage_gras' })
  pourcentageGras: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, name: 'imc_actuel' })
  imcActuel: number;

  @Column({ type: 'int', nullable: true, name: 'bpm_moyen_journee' })
  bpmMoyenJournee: number;

  @Column({ type: 'int', nullable: true, name: 'bpm_repos' })
  bpmRepos: number;

  @Column({ type: 'int', nullable: true, name: 'nb_pas' })
  nbPas: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'heures_sommeil' })
  heuresSommeil: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'hydratation_litres' })
  hydratationLitres: number;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.logsSante, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;

  @Column({ type: 'int', nullable: false, name: 'id_utilisateur' })
  idUtilisateur: number;
}

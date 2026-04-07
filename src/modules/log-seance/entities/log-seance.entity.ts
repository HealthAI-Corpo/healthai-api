import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { Exercice } from '../../exercice/entities/exercice.entity';

@Entity('log_seance')
export class LogSeance {
  @PrimaryGeneratedColumn({ name: 'id_seance_log' })
  idSeanceLog: number;

  @Column({ type: 'timestamp', nullable: false, name: 'log_date' })
  @Index()
  logDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'type_seance' })
  @Index()
  typeSeance: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
    name: 'duree_minutes',
  })
  dureeMinutes: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 1,
    nullable: true,
    name: 'calorie_brulee',
  })
  calorieBrulee: number;

  @Column({ type: 'int', nullable: true, name: 'bpm_moyen' })
  bpmMoyen: number;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.logsSeance, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;

  @Column({ type: 'int', nullable: false, name: 'id_utilisateur' })
  idUtilisateur: number;

  @ManyToOne(() => Exercice, (exercice) => exercice.logsSeance, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: false,
  })
  @JoinColumn({ name: 'id_exercice' })
  exercice: Exercice;

  @Column({ type: 'int', nullable: false, name: 'id_exercice' })
  idExercice: number;
}

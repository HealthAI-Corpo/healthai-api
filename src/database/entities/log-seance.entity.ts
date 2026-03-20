import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Exercice } from './exercice.entity';
import { Utilisateur } from './utilisateur.entity';

@Entity('log_seance')
export class LogSeance {
  @PrimaryGeneratedColumn({ name: 'id_seance_log' })
  idSeanceLog: number;

  @CreateDateColumn({
    name: 'log_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  logDate: Date;

  @Column({ name: 'duree_exercice', type: 'numeric', precision: 5, scale: 1 })
  dureeExercice: string;

  @Column({ name: 'calorie_brulee', type: 'numeric', precision: 6, scale: 1 })
  calorieBrulee: string;

  @ManyToOne(() => Exercice, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'id_exercice' })
  exercice: Exercice;

  @ManyToOne(() => Utilisateur, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;
}

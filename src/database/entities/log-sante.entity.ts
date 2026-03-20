import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Utilisateur } from './utilisateur.entity';

@Entity('log_sante')
export class LogSante {
  @PrimaryGeneratedColumn({ name: 'id_log_sante' })
  idLogSante: number;

  @CreateDateColumn({
    name: 'date_log',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateLog: Date;

  @Column({ name: 'poids_kg', type: 'numeric', precision: 5, scale: 2 })
  poidsKg: string;

  @Column({ name: 'moyenne_bpm', type: 'numeric', precision: 4, scale: 1 })
  moyenneBpm: string;

  @Column({ name: 'heures_sommeil', type: 'numeric', precision: 4, scale: 2 })
  heuresSommeil: string;

  @Column({ name: 'nb_pas', type: 'integer', default: 0 })
  nbPas: number;

  @Column({ name: 'frequence_cardiaque', type: 'integer', nullable: true })
  frequenceCardiaque: number | null;

  @ManyToOne(() => Utilisateur, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Aliment } from './aliment.entity';
import { Utilisateur } from './utilisateur.entity';

@Entity('log_aliment')
export class LogAliment {
  @PrimaryGeneratedColumn({ name: 'id_log_aliment' })
  idLogAliment: number;

  @CreateDateColumn({
    name: 'log_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  logDate: Date;

  @Column({ name: 'repas', type: 'varchar', length: 50 })
  repas: string;

  @Column({ name: 'quantite_g', type: 'numeric', precision: 7, scale: 2 })
  quantiteG: string;

  @ManyToOne(() => Aliment, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'id_aliment' })
  aliment: Aliment;

  @ManyToOne(() => Utilisateur, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;
}

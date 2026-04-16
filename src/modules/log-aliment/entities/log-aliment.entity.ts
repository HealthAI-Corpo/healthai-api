import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { Aliment } from '../../aliment/entities/aliment.entity';

@Entity('log_aliment')
export class LogAliment {
  @PrimaryGeneratedColumn({ name: 'id_log_aliment' })
  idLogAliment: number;

  @Column({ type: 'timestamp', nullable: false, name: 'log_date' })
  @Index()
  logDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'type_repas' })
  @Index()
  typeRepas: string;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: false,
    name: 'quantite_g',
  })
  quantiteG: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unite: string;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.logsAliment, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;

  @Column({ type: 'int', nullable: false, name: 'id_utilisateur' })
  idUtilisateur: number;

  @ManyToOne(() => Aliment, (aliment) => aliment.logsAliment, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: false,
  })
  @JoinColumn({ name: 'id_aliment' })
  aliment: Aliment;

  @Column({ type: 'int', nullable: false, name: 'id_aliment' })
  idAliment: number;
}

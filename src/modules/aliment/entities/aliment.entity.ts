import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { LogAliment } from '../../log-aliment/entities/log-aliment.entity';

@Entity('aliment')
export class Aliment {
  @PrimaryGeneratedColumn({ name: 'id_aliment' })
  idAliment: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nom: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categorie: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'type_repas' })
  @Index()
  typeRepas: string;

  @Column({ type: 'decimal', precision: 6, scale: 1, nullable: true })
  calories: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  proteines: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  lipides: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  glucides: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  fibres: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  sucres: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true, name: 'sodium_mg' })
  sodiumMg: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true, name: 'cholesterol_mg' })
  cholesterolMg: number;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'unite_mesure' })
  uniteMesure: string;

  @OneToMany(() => LogAliment, (logAliment) => logAliment.aliment, {
    eager: false,
  })
  logsAliment: LogAliment[];
}

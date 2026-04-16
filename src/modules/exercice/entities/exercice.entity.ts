import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { LogSeance } from '../../log-seance/entities/log-seance.entity';

@Entity('exercice')
export class Exercice {
  @PrimaryGeneratedColumn({ name: 'id_exercice' })
  idExercice: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nom: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'type_exercice',
  })
  @Index()
  typeExercice: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'muscles_principaux',
  })
  musclePrincipal: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'muscles_secondaires',
  })
  muscleSecondaire: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  equipement: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  difficulte: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @OneToMany(() => LogSeance, (logSeance) => logSeance.exercice, {
    eager: false,
  })
  logsSeance: LogSeance[];
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exercice')
export class Exercice {
  @PrimaryGeneratedColumn({ name: 'id_exercice' })
  idExercice: number;

  @Column({ name: 'nom', type: 'varchar', length: 150 })
  nom: string;

  @Column({ name: 'type_exercice', type: 'varchar', length: 100 })
  typeExercice: string;

  @Column({
    name: 'muscle_cible',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  muscleCible: string | null;

  @Column({ name: 'equipement', type: 'varchar', length: 100, nullable: true })
  equipement: string | null;

  @Column({ name: 'difficulte', type: 'varchar', length: 50, nullable: true })
  difficulte: string | null;

  @Column({ name: 'instructions', type: 'text', nullable: true })
  instructions: string | null;
}

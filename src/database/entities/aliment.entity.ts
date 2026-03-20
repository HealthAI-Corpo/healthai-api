import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('aliment')
export class Aliment {
  @PrimaryGeneratedColumn({ name: 'id_aliment' })
  idAliment: number;

  @Column({ name: 'nom', type: 'varchar', length: 100 })
  nom: string;

  @Column({ name: 'calories', type: 'numeric', precision: 6, scale: 1 })
  calories: string;

  @Column({ name: 'proteines', type: 'numeric', precision: 4, scale: 1 })
  proteines: string;

  @Column({ name: 'lipides', type: 'numeric', precision: 4, scale: 1 })
  lipides: string;

  @Column({ name: 'glucides', type: 'numeric', precision: 4, scale: 1 })
  glucides: string;

  @Column({
    name: 'unite_mesure',
    type: 'varchar',
    length: 20,
    default: '100g',
  })
  uniteMesure: string;
}

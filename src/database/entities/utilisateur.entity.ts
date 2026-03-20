import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('utilisateur')
@Index('uq_utilisateur_email_lower', { synchronize: false })
export class Utilisateur {
  @PrimaryGeneratedColumn({ name: 'id_utilisateur' })
  idUtilisateur: number;

  @Column({ name: 'nom', type: 'varchar', length: 50 })
  nom: string;

  @Column({ name: 'prenom', type: 'varchar', length: 50 })
  prenom: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'date_naissance', type: 'date' })
  dateNaissance: string;

  @Column({ name: 'genre', type: 'varchar', length: 50 })
  genre: string;

  @Column({ name: 'objectif_principal', type: 'varchar', length: 200 })
  objectifPrincipal: string;

  @Column({ name: 'poids_actuel', type: 'numeric', precision: 5, scale: 2 })
  poidsActuel: string;

  @Column({ name: 'taille_cm', type: 'integer' })
  tailleCm: number;

  @Column({
    name: 'type_abonnement',
    type: 'varchar',
    length: 50,
    default: 'Freemium',
  })
  typeAbonnement: 'Freemium' | 'Premium';

  @CreateDateColumn({
    name: 'date_inscription',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateInscription: Date;

  @Column({ name: 'mot_de_passe_hash', type: 'varchar', length: 255 })
  motDePasseHash: string;
}

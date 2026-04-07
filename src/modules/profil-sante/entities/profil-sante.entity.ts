import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity('profil_sante')
export class ProfilSante {
  @PrimaryGeneratedColumn({ name: 'id_profil_sante' })
  idProfilSante: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'poids_kg' })
  poidsKg: number;

  @Column({ type: 'int', nullable: true, name: 'taille_cm' })
  tailleCm: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  imc: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'niveau_activite' })
  niveauActivite: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'type_maladie' })
  @Index()
  typeMaladie: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  severite: string;

  @Column({ type: 'text', nullable: true, name: 'restrictions_alimentaires' })
  restrictionsAlimentaires: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'objectif_principal' })
  objectifPrincipal: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'experience_sportive' })
  experienceSportive: string;

  @Column({ type: 'int', nullable: true, name: 'frequence_entrainement' })
  frequenceEntrainement: number;

  @OneToOne(() => Utilisateur, (utilisateur) => utilisateur.profilSante, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;

  @Column({ type: 'int', nullable: false, unique: true, name: 'id_utilisateur' })
  @Index()
  idUtilisateur: number;
}

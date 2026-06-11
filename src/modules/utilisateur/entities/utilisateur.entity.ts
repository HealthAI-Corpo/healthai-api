import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { LogAliment } from '../../log-aliment/entities/log-aliment.entity';
import { LogSeance } from '../../log-seance/entities/log-seance.entity';
import { LogSante } from '../../log-sante/entities/log-sante.entity';
import { ProfilSante } from '../../profil-sante/entities/profil-sante.entity';

@Entity('utilisateur')
export class Utilisateur {
  @PrimaryGeneratedColumn({ name: 'id_utilisateur' })
  idUtilisateur: number;

  // Identifiant unique (claim "sub") de l'utilisateur dans Zitadel.
  // Nullable : les comptes créés avant la délégation d'auth n'en ont pas.
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    unique: true,
    name: 'zitadel_id',
  })
  @Index()
  zitadelId: string | null;

  // Nullables : un utilisateur provisionné au 1er login Zitadel n'a que
  // son email — il complète son profil ensuite.
  @Column({ type: 'varchar', length: 50, nullable: true })
  nom: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  prenom: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @Index()
  email: string;

  @Column({ type: 'date', nullable: true, name: 'date_de_naissance' })
  dateDeNaissance: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  genre: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'type_abonnement',
  })
  typeAbonnement: string;

  @CreateDateColumn({ type: 'timestamp', name: 'date_inscription' })
  dateInscription: Date;

  // Nullable : l'authentification est déléguée à Zitadel, seuls les
  // anciens comptes locaux ont encore un hash.
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'mot_de_passe_hash',
  })
  motDePasseHash: string | null;

  @OneToMany(() => LogAliment, (logAliment) => logAliment.utilisateur, {
    cascade: true,
    eager: false,
  })
  logsAliment: LogAliment[];

  @OneToMany(() => LogSeance, (logSeance) => logSeance.utilisateur, {
    cascade: true,
    eager: false,
  })
  logsSeance: LogSeance[];

  @OneToMany(() => LogSante, (logSante) => logSante.utilisateur, {
    cascade: true,
    eager: false,
  })
  logsSante: LogSante[];

  @OneToOne(() => ProfilSante, (profilSante) => profilSante.utilisateur, {
    cascade: true,
    eager: false,
  })
  profilSante: ProfilSante;
}

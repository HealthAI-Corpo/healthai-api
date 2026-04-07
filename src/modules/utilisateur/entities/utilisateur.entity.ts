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

  @Column({ type: 'varchar', length: 50, nullable: false })
  nom: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  prenom: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @Index()
  email: string;

  @Column({ type: 'date', nullable: true, name: 'date_de_naissance' })
  dateDeNaissance: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  genre: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'type_abonnement',
  })
  typeAbonnement: string;

  @CreateDateColumn({ type: 'timestamp', name: 'date_inscription' })
  dateInscription: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'mot_de_passe_hash',
  })
  motDePasseHash: string;

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

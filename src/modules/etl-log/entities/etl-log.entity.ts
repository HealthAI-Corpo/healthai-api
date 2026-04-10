import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum StatutEtlEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  PARTIAL_FAILURE = 'PARTIAL_FAILURE',
  FAILURE = 'FAILURE',
}

@Entity('etl_log')
export class EtlLog {
  @PrimaryGeneratedColumn({ name: 'id_etl_log' })
  idEtlLog: number;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'libelle_pipeline' })
  libellePipeline: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'fichier_nom' })
  fichierNom: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'date_execution',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateExecution: Date;

  @Column({ type: 'int', nullable: true, name: 'nb_lignes_total' })
  nbLignesTotal: number;

  @Column({ type: 'int', nullable: true, name: 'nb_lignes_valides' })
  nbLignesValides: number;

  @Column({ type: 'int', nullable: true, name: 'nb_lignes_anomalies' })
  nbLignesAnomalies: number;

  @Column({
    type: 'enum',
    enum: StatutEtlEnum,
    nullable: true,
  })
  statut: StatutEtlEnum;

  @Column({ type: 'text', nullable: true })
  message: string;
}

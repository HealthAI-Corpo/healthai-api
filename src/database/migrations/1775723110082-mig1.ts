import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig11775723110082 implements MigrationInterface {
  name = 'Mig11775723110082';

  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> { }
}

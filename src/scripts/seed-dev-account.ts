import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AppModule } from '../app.module';
import { Utilisateur } from '../database/entities/utilisateur.entity';

const logger = new Logger('SeedDevAccount');

async function seedDevAccount(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed default account in production');
  }

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const utilisateurRepository = app.get<Repository<Utilisateur>>(
      getRepositoryToken(Utilisateur),
    );
    const email =
      process.env.DEV_DEFAULT_USER_EMAIL ?? 'dev-admin@healthai.local';
    const password =
      process.env.DEV_DEFAULT_USER_PASSWORD ?? 'ChangeMe123!dev-account';

    const existingUser = await utilisateurRepository.findOne({
      where: { email },
    });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      existingUser.motDePasseHash = hashedPassword;
      await utilisateurRepository.save(existingUser);
      logger.log(`Updated dev account password for "${email}"`);
      return;
    }

    await utilisateurRepository.save(
      utilisateurRepository.create({
        nom: process.env.DEV_DEFAULT_USER_NOM ?? 'Dev',
        prenom: process.env.DEV_DEFAULT_USER_PRENOM ?? 'Admin',
        email,
        dateNaissance: process.env.DEV_DEFAULT_USER_DOB ?? '1990-01-01',
        genre: process.env.DEV_DEFAULT_USER_GENRE ?? 'Unspecified',
        objectifPrincipal:
          process.env.DEV_DEFAULT_USER_OBJECTIF ?? 'General fitness',
        poidsActuel: process.env.DEV_DEFAULT_USER_POIDS ?? '70.00',
        tailleCm: Number(process.env.DEV_DEFAULT_USER_TAILLE_CM ?? 175),
        typeAbonnement:
          process.env.DEV_DEFAULT_USER_ABONNEMENT === 'Premium'
            ? 'Premium'
            : 'Freemium',
        motDePasseHash: hashedPassword,
      }),
    );
    logger.log(`Created default dev account "${email}"`);
  } finally {
    await app.close();
  }
}

void seedDevAccount().catch((error: unknown) => {
  logger.error('Failed to seed dev account', error);
  process.exitCode = 1;
});

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AppModule } from '../app.module';
import { User } from '../auth/entities/user.entity';

const logger = new Logger('SeedDevAccount');

async function seedDevAccount(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed default account in production');
  }

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    const email =
      process.env.DEV_DEFAULT_USER_EMAIL ?? 'dev-admin@healthai.local';
    const password =
      process.env.DEV_DEFAULT_USER_PASSWORD ?? 'ChangeMe123!dev-account';

    const existingUser = await userRepository.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      existingUser.password = hashedPassword;
      await userRepository.save(existingUser);
      logger.log(`Updated dev account password for "${email}"`);
      return;
    }

    await userRepository.save(
      userRepository.create({
        email,
        password: hashedPassword,
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

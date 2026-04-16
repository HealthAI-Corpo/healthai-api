import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { normalizeOrigin } from './common/cors-origin.util';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const allowedOrigins = configService
    .getOrThrow<string>('FRONTEND_ORIGIN')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
    .map((origin) => normalizeOrigin(origin));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (origin === undefined) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS policy: origin not allowed'));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('HealthAI API')
    .setDescription(
      '🏥 API REST pour la gestion de données de santé et bien-être\n\n' +
        '**Fonctionnalités principales:**\n' +
        '- Authentification JWT sécurisée\n' +
        '- Gestion utilisateurs et profils santé\n' +
        '- Catalogues aliments et exercices\n' +
        '- Journaux alimentaires et séances\n' +
        '- Métriques de santé quotidiennes\n' +
        '- Datasets IA pour recommandations\n\n' +
        '**Sécurité:**\n' +
        '- API Key globale (header `x-api-key`)\n' +
        '- Client ID validation (header `x-client-id`)\n' +
        '- JWT Bearer tokens',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre JWT token obtenu via POST /auth/login',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'Clé API globale (requise sur toutes les routes)',
      },
      'api-key',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-client-id',
        in: 'header',
        description: 'Identifiant client frontend',
      },
      'client-id',
    )
    .addTag('auth', 'Authentification et gestion des sessions')
    .addTag('utilisateurs', 'Gestion des utilisateurs')
    .addTag(
      'aliments',
      'Catalogue des aliments et informations nutritionnelles',
    )
    .addTag('exercices', 'Catalogue des exercices')
    .addTag('log-aliments', 'Journal alimentaire des utilisateurs')
    .addTag('log-seances', "Journal d'entraînement")
    .addTag('log-santes', 'Métriques de santé quotidiennes')
    .addTag('profil-sante', 'Profils santé des utilisateurs')
    .addTag('datasets-recommandations', 'Dataset IA - Recommandations régimes')
    .addTag('datasets-exercices', 'Dataset IA - Historique séances exercice')
    .addTag('health', 'Endpoints de monitoring et health checks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Setup Swagger UI at /doc
  SwaggerModule.setup('doc', app, document, {
    customSiteTitle: 'HealthAI API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    jsonDocumentUrl: '/doc-json', // This makes /doc-json public automatically
  });

  const port = configService.get<number>('PORT', 3000);
  // Bind to 0.0.0.0 in Docker so the container port mapping works reliably
  await app.listen(port, '0.0.0.0');
  console.log(`HealthAI API listening on port ${port} (host 0.0.0.0)`);
}
void bootstrap().catch(console.error);

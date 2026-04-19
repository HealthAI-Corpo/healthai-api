# healthai-api

Backend REST API de la plateforme HealthAI Coach — gestion des utilisateurs, données de santé et datasets IA.

## Stack technique

| Couche | Technologie |
|--------|------------|
| Framework | NestJS 11.x (Express) |
| Langage | TypeScript 5.7 |
| ORM | TypeORM 0.3 (lecture seule — schéma géré par healthai-infra) |
| Base de données | PostgreSQL 15 |
| Auth | Passport JWT + bcrypt |
| Validation | class-validator · class-transformer · Joi |
| Documentation | Swagger / OpenAPI (`/doc`) |
| Monitoring | NestJS Terminus (health check) |
| Tests | Jest · Supertest |

## Endpoints

| Groupe | Routes |
|--------|--------|
| Auth | `POST /auth/login` |
| Health | `GET /health` |
| Utilisateurs | `CRUD /utilisateurs` |
| Aliments | `CRUD /aliments` |
| Exercices | `CRUD /exercices` |
| Logs alimentaires | `CRUD /logs-aliment` |
| Logs séances | `CRUD /logs-seance` |
| Logs santé | `CRUD /logs-sante` |
| Profils santé | `CRUD /profils-sante` |
| Dataset régimes | `CRUD /datasets/recommandations-regime` |
| Dataset exercices | `CRUD /datasets/historique-seance-exercice` |

Documentation interactive complète : `http://localhost:3001/doc`

## Sécurité

Toutes les routes (sauf `POST /auth/login` et `GET /health`) requièrent :

```http
x-api-key: <API_KEY>
x-client-id: <FRONTEND_CLIENT_ID>
Authorization: Bearer <jwt_token>   ← routes protégées uniquement
```

## Installation

```bash
npm install
```

## Variables d'environnement

```env
DATABASE_URL=postgresql://healthai:password@localhost:5432/healthai_db
JWT_SECRET=<min 32 chars>
JWT_ISSUER=healthai-api
JWT_AUDIENCE=healthai-web
JWT_EXPIRES_IN=3600s
API_KEY=<min 32 chars>
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_CLIENT_ID=healthai-admin-front
PORT=3001
NODE_ENV=development
```

## Scripts

```bash
npm run start:dev        # Développement (watch mode)
npm run start:prod       # Production
npm run build            # Compilation TypeScript

npm run test             # Tests unitaires (Jest)
npm run test:e2e         # Tests end-to-end
npm run test:cov         # Couverture de tests

npm run lint             # ESLint
npm run format           # Prettier

npm run migration:generate   # Générer une migration depuis les entités
npm run migration:create     # Créer un fichier de migration vide
npm run migration:run        # Appliquer les migrations
npm run migration:revert     # Annuler la dernière migration

npm run seed:dev-account     # Créer un compte dev (développement uniquement)
```

> **Note schéma** : le schéma de base est géré par golang-migrate dans `healthai-infra/db/migrations/`.  
> TypeORM est configuré en lecture seule (`TYPEORM_RUN_MIGRATIONS=false` en production).  
> `migration:run` est réservé au développement local.

## Démarrage local

```bash
# 1. Démarrer PostgreSQL (via healthai-infra)
docker compose up -d db db-migrator

# 2. Copier et remplir les variables
cp .env.example .env

# 3. Créer un compte de test
npm run seed:dev-account

# 4. Lancer l'API
npm run start:dev
# → http://localhost:3001
# → http://localhost:3001/doc  (Swagger)
```

## Docker

L'image est buildée et publiée automatiquement sur GHCR via CI :

```bash
# Build local
docker build -t healthai-api:local .

# Via healthai-infra (recommandé)
docker compose up -d healthai-api
```

## Structure

```
src/
├── auth/               # JWT strategy, guards, login endpoint
├── database/           # TypeORM datasource, migrations
├── modules/
│   ├── utilisateurs/
│   ├── aliments/
│   ├── exercices/
│   ├── logs-aliment/
│   ├── logs-seance/
│   ├── logs-sante/
│   ├── profils-sante/
│   └── datasets/
│       ├── recommandations-regime/
│       └── historique-seance-exercice/
└── main.ts
```

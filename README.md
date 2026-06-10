<div align="center">

# HealthAI API

**REST API de la plateforme HealthAI Coach** — gestion des utilisateurs, données de santé et datasets IA.

[![CI](https://github.com/HealthAI-Corpo/healthai-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/HealthAI-Corpo/healthai-api/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/HealthAI-Corpo/healthai-api?logo=github)](https://github.com/HealthAI-Corpo/healthai-api/releases)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org)

[Architecture](#architecture) · [Démarrage rapide](#démarrage-rapide) · [Authentification](#authentification) · [API](#endpoints) · [CI/CD](#cicd)

</div>

---

## Sommaire

- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Authentification](#authentification)
- [Démarrage rapide](#démarrage-rapide)
- [Variables d'environnement](#variables-denvironnement)
- [Endpoints](#endpoints)
- [Scripts](#scripts)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Structure du projet](#structure-du-projet)
- [Configuration Zitadel](#configuration-zitadel)

---

## Architecture

```mermaid
flowchart LR
    subgraph CLIENTS["Clients"]
        WEB["healthai-web\nNext.js"]
        ETL["healthai-etl\nFastAPI"]
    end

    subgraph IDP["Identité"]
        ZIT["Zitadel\nOIDC Provider"]
    end

    subgraph API["healthai-api (ce repo)"]
        GUARD["JwtAuthGuard\nvalidation RS256 / JWKS"]
        MODULES["Modules métier\nutilisateurs · logs · profils · datasets"]
    end

    DB[("PostgreSQL 15")]

    WEB -- "login OIDC" --> ZIT
    ZIT -- "JWT (sub, email, rôles)" --> WEB
    WEB -- "Bearer JWT" --> GUARD
    ETL -- "Bearer JWT" --> GUARD
    GUARD --> MODULES
    MODULES --> DB
    GUARD -. "JWKS (clés publiques,\ncache 10 min)" .-> ZIT
```

L'API ne stocke **aucun mot de passe** et n'émet **aucun token** : l'identité est entièrement déléguée à Zitadel. Chaque requête porte un Bearer JWT validé localement (signature RS256, issuer, audience) via le JWKS public de Zitadel.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | NestJS 11 (Express) |
| Langage | TypeScript 5.7 |
| Base de données | PostgreSQL 15 · TypeORM 0.3 (migrations) |
| Identité | Zitadel — OIDC, validation JWKS RS256 |
| Validation | class-validator · class-transformer · Joi |
| Sécurité | Helmet · @nestjs/throttler (rate limiting) |
| Messaging | RabbitMQ (@nestjs/microservices) |
| Documentation | Swagger / OpenAPI — `/api` |
| Monitoring | NestJS Terminus — `/health` |
| Tests | Jest · Supertest |
| Release | git-cliff · semver automatique · ghcr.io |

---

## Authentification

### Validation des requêtes

```
Requête entrante
  ↓
Rate limiter        100 req / 60 s par IP (configurable)
  ↓
JwtAuthGuard        global — toutes les routes sauf @Public()
  │                 signature RS256 · issuer · audience · expiration
  ↓
Endpoint            payload Zitadel accessible via @CurrentUser()
```

### Provisioning JIT (Just-In-Time)

Zitadel est la **source de vérité** de l'identité. La base métier se remplit automatiquement au premier login — aucune création manuelle de compte :

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant Z as Zitadel
    participant W as healthai-web
    participant A as healthai-api
    participant DB as PostgreSQL

    U->>Z: Login (email + mot de passe)
    Z-->>W: JWT (sub, email, rôles)
    W->>A: POST /utilisateurs/sync (Bearer JWT)
    A->>A: Validation JWT (JWKS)
    A->>DB: upsert par zitadel_id
    Note over A,DB: 1. zitadel_id connu → no-op<br/>2. email connu → rattachement legacy<br/>3. inconnu → création
    A-->>W: Utilisateur
```

L'endpoint `sync` lit `sub` et `email` **depuis le token validé** — jamais depuis le body. Il est idempotent : rappelé à chaque login sans effet de bord.

---

## Démarrage rapide

### Prérequis

- Node.js 20+
- PostgreSQL 15 en cours d'exécution
- Une instance Zitadel configurée ([voir plus bas](#configuration-zitadel))

### Installation

```bash
# 1. Dépendances
npm install

# 2. Configuration
cp .env.example .env        # puis éditer les valeurs

# 3. Migrations
npm run migration:run

# 4. Lancement (watch mode)
npm run start:dev
```

L'API écoute sur `http://localhost:3001` — Swagger UI sur `http://localhost:3001/api`.

---

## Variables d'environnement

| Variable | Requis | Description |
|---|:---:|---|
| `DATABASE_URL` | ✅ | Chaîne de connexion PostgreSQL |
| `ZITADEL_DOMAIN` | ✅ | URL de l'instance Zitadel |
| `JWT_ISSUER` | ✅ | Issuer attendu dans les tokens (= `ZITADEL_DOMAIN` en général) |
| `JWT_AUDIENCE` | ✅ | **Project ID** du projet Zitadel contenant l'app front |
| `FRONTEND_ORIGIN` | ✅ | Origines CORS autorisées (séparées par des virgules) |
| `THROTTLE_TTL` | — | Fenêtre de rate limit en ms (défaut `60000`) |
| `THROTTLE_LIMIT` | — | Requêtes max par fenêtre et par IP (défaut `100`) |
| `PORT` | — | Port HTTP (défaut `3001`) |
| `NODE_ENV` | — | `development` / `production` / `test` |

Modèle complet prêt à copier : [`.env.example`](.env.example).

---

## Endpoints

Documentation interactive complète (schémas requête/réponse) sur **`/api`** (Swagger UI).

| Groupe | Route | Description |
|---|---|---|
| Auth | `GET /auth/validate` | Forward-auth Traefik — valide le Bearer, injecte `X-User-Id` |
| Santé | `GET /health` | Publique — ping base de données |
| Utilisateurs | `POST /utilisateurs/sync` | **Provisioning JIT** depuis le token Zitadel (idempotent) |
| Utilisateurs | `CRUD /utilisateurs` | Gestion des comptes |
| Aliments | `CRUD /aliments` | Référentiel nutritionnel |
| Exercices | `CRUD /exercices` | Référentiel sportif |
| Logs aliments | `CRUD /log-aliment` | Journal nutritionnel |
| Logs séances | `CRUD /log-seance` | Journal d'entraînement |
| Logs santé | `CRUD /log-sante` | Mesures de santé |
| Profils santé | `CRUD /profil-sante` | Un par utilisateur |
| Datasets IA | `CRUD /datasets/recommandations-regime` | Données nettoyées pour l'IA |
| Datasets IA | `CRUD /datasets/historique-seance-exercice` | Données nettoyées pour l'IA |

> Toutes les routes exigent un Bearer JWT Zitadel valide, sauf `GET /health`.

---

## Scripts

```bash
# Développement
npm run start:dev          # watch mode
npm run start:debug        # debug + watch

# Build & production
npm run build
npm run start:prod

# Base de données
npm run migration:generate # génère une migration depuis les entités
npm run migration:run      # applique les migrations
npm run migration:revert   # annule la dernière migration

# Qualité
npm run test               # tests unitaires
npm run test:cov           # couverture
npm run test:e2e           # tests end-to-end
npm run lint               # ESLint (auto-fix)
npm run format             # Prettier
```

---

## Docker

Image multi-stage, exécutée en utilisateur **non-root** (`node`), publiée sur **ghcr.io** :

```bash
docker pull ghcr.io/healthai-corpo/healthai-api:latest
```

```bash
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/healthai_db" \
  -e ZITADEL_DOMAIN="https://votre-zitadel" \
  -e JWT_ISSUER="https://votre-zitadel" \
  -e JWT_AUDIENCE="<project-id-frontend>" \
  -e FRONTEND_ORIGIN="https://votre-front" \
  ghcr.io/healthai-corpo/healthai-api:latest
```

> Le conteneur doit pouvoir joindre Zitadel pour récupérer les clés JWKS au premier appel. Les migrations TypeORM s'exécutent au démarrage.

---

## CI/CD

```
PR → develop          lint + tests (status check « CI » requis)
develop → main        PR obligatoire depuis develop (check-source-branch)
merge sur main        version calculée par git-cliff (conventional commits)
                      → build & push ghcr.io :vX.Y.Z + :latest
                      → tag git + GitHub Release avec changelog
```

| Workflow | Rôle |
|---|---|
| `ci.yml` | ESLint · Jest (+ Postgres service) · build & release sur main |
| `commitlint.yml` | Convention de commits (`feat:`, `fix:`, …) imposée sur les PRs |
| `check-source-branch.yml` | Les PRs vers `main` doivent venir de `develop` |

Le versioning est **entièrement automatique** : `fix:` → patch, `feat:` → minor, `BREAKING CHANGE` → major.

---

## Structure du projet

```
src/
├── auth/                  # Stratégie JWT Zitadel, guards, décorateurs
│   ├── guards/            #   JwtAuthGuard (global)
│   └── decorators/        #   @Public() · @CurrentUser()
├── common/                # CORS, filtre d'exceptions global
├── config/                # Validation Joi des variables d'env
├── database/              # Datasource TypeORM, migrations
├── health/                # Health check (Terminus)
├── rabbitmq/              # Connexion broker (@nestjs/microservices)
└── modules/
    ├── utilisateur/       # + provisioning JIT (/utilisateurs/sync)
    ├── aliment/
    ├── exercice/
    ├── log-aliment/
    ├── log-seance/
    ├── log-sante/
    ├── profil-sante/
    ├── etl-log/
    └── datasets/
        ├── recommandations-regime/
        └── historique-seance-exercice/
```

---

## Configuration Zitadel

Un **seul projet** Zitadel (« Frontend ») porte l'app web, les rôles et l'audience :

1. **Projet → General** : cocher *Return user roles during authentication*
2. **Projet → Roles** : créer `admin` et `user`
3. **Projet → Role Assignments** : assigner les rôles aux utilisateurs
4. **App web → Token Settings** :
   - *Auth Token Type* = **JWT** (l'API valide en local via JWKS — un token opaque serait rejeté)
   - cocher *Add user roles to the access token*
   - cocher *User roles inside ID Token*
5. **Côté API** : `JWT_AUDIENCE` = **Project ID** du projet (tous les tokens émis pour les apps du projet le portent en audience)

L'API valide les tokens sur `{ZITADEL_DOMAIN}/oauth/v2/keys` (JWKS, cache 10 min). Aucune app Zitadel dédiée à l'API n'est nécessaire.

---

<div align="center">
<sub>HealthAI Coach — projet MSPR · <a href="https://github.com/HealthAI-Corpo">HealthAI-Corpo</a></sub>
</div>

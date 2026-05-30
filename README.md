<div align="center">

# HealthAI API

**REST API for the HealthAI Coach platform**

[![CI](https://github.com/HealthAI-Corpo/healthai-api/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/HealthAI-Corpo/healthai-api/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/ghcr.io-healthai--api-0db7ed?logo=docker)](https://github.com/HealthAI-Corpo/healthai-api/pkgs/container/healthai-api)

User management · Health data · AI datasets · Zitadel OIDC authentication

</div>

---

## Table of contents

- [Stack](#stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API endpoints](#api-endpoints)
- [Docker](#docker)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Zitadel setup](#zitadel-setup)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (Express) |
| Language | TypeScript 5.7 |
| Database | PostgreSQL 15 via TypeORM 0.3 |
| Identity | Zitadel (OIDC — RS256 JWKS validation) |
| Validation | class-validator · class-transformer · Joi |
| Security | Helmet · @nestjs/throttler · JwtAuthGuard |
| Docs | Swagger / OpenAPI at `/api` |
| Monitoring | NestJS Terminus (`/health`) |
| Tests | Jest · Supertest |

---

## Architecture

### Security model

Every incoming request passes through two global guards before reaching any endpoint:

```
Incoming request
        │
        ▼
┌───────────────────┐
│   ThrottlerGuard  │  100 req / 60 s per IP (configurable)
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   JwtAuthGuard    │  Validates Zitadel RS256 Bearer token via JWKS
└───────────────────┘
        │
        ├── @Public() route? ──► Allow (no token required)
        │
        ├── Valid token? ──────► req.user = { sub, email, roles, … }
        │
        └── No / invalid token ► 401 Unauthorized
```

**Key properties:**
- The API **never issues tokens** — authentication is fully delegated to Zitadel
- JWKS public keys are fetched once and cached for 10 minutes — no per-request network call
- `@Public()` routes: `GET /health` (readiness probe) and `GET /auth/validate` (Traefik forward-auth)
- CORS restricts browser calls to origins listed in `FRONTEND_ORIGIN`

### Request flow (Traefik forward-auth)

```
Browser ──► Traefik ──► GET /auth/validate ──► Upstream service
                               │
                        Validates JWT
                        Injects headers:
                          X-User-Id
                          X-User-Role
```

---

## Getting started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+ (local, Docker, or cloud)
- **Zitadel** project with an API application configured

### 1. Clone & install

```bash
git clone https://github.com/HealthAI-Corpo/healthai-api.git
cd healthai-api
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` — the required variables are listed [below](#environment-variables). The `.env.example` already contains the real Zitadel URLs for this project.

### 3. Start the server

```bash
npm run start:dev
```

Migrations run **automatically** on startup (`TYPEORM_RUN_MIGRATIONS=true` by default).

```
http://localhost:3001        API
http://localhost:3001/api    Swagger UI (development only)
http://localhost:3001/health Readiness probe
```

### 4. (Optional) seed a dev user

```bash
npm run seed:dev-account
```

> Requires `DEV_DEFAULT_USER_EMAIL` and `DEV_DEFAULT_USER_PASSWORD` to be set. Refuses to run outside `NODE_ENV=development`.

---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string (`postgresql://user:pass@host:5432/db`) |
| `ZITADEL_DOMAIN` | ✅ | — | Your Zitadel instance URL |
| `JWT_ISSUER` | ✅ | — | Must match the `iss` claim in Zitadel tokens (usually same as `ZITADEL_DOMAIN`) |
| `JWT_AUDIENCE` | ✅ | — | Client ID of your NestJS API app in Zitadel |
| `FRONTEND_ORIGIN` | ✅ | — | Comma-separated list of allowed CORS origins |
| `PORT` | — | `3001` | HTTP port |
| `NODE_ENV` | — | `development` | `development` / `production` / `test` |
| `THROTTLE_TTL` | — | `60000` | Rate limit window in ms |
| `THROTTLE_LIMIT` | — | `100` | Max requests per window per IP |
| `TYPEORM_RUN_MIGRATIONS` | — | `true` | Run pending migrations on startup |
| `DEV_DEFAULT_USER_EMAIL` | — | — | Dev seed account email |
| `DEV_DEFAULT_USER_PASSWORD` | — | — | Dev seed account password (min 8 chars) |

---

## API endpoints

Interactive documentation with full request/response schemas is available at [`/api`](http://localhost:3001/api) (Swagger UI) when the server is running.

| Group | Base path | Auth | Description |
|---|---|---|---|
| Auth | `GET /auth/validate` | Public | Traefik forward-auth — validates Bearer token, injects `X-User-Id` + `X-User-Role` |
| Health | `GET /health` | Public | Readiness probe — database ping |
| Users | `/utilisateurs` | 🔒 | CRUD — user management |
| Foods | `/aliments` | 🔒 | CRUD — food catalog |
| Exercises | `/exercices` | 🔒 | CRUD — exercise catalog |
| Food logs | `/log-aliment` | 🔒 | CRUD — user food journal |
| Session logs | `/log-seance` | 🔒 | CRUD — training sessions |
| Health logs | `/log-sante` | 🔒 | CRUD — daily health metrics |
| Health profiles | `/profil-sante` | 🔒 | CRUD — one profile per user |
| AI dataset — diets | `/datasets/recommandations-regime` | 🔒 | Pre-cleaned data for AI training |
| AI dataset — sessions | `/datasets/historique-seance-exercice` | 🔒 | Pre-cleaned data for AI training |

> 🔒 Requires a valid Zitadel Bearer token in the `Authorization` header.

---

## Docker

### Production image

```bash
# Build
docker build -t healthai-api .

# Run
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:password@host:5432/healthai_db" \
  -e ZITADEL_DOMAIN="https://your-zitadel-instance.zitadel.cloud" \
  -e JWT_ISSUER="https://your-zitadel-instance.zitadel.cloud" \
  -e JWT_AUDIENCE="<client-id>" \
  -e FRONTEND_ORIGIN="https://your-frontend.com" \
  healthai-api
```

The image is published automatically to [ghcr.io/healthai-corpo/healthai-api](https://github.com/HealthAI-Corpo/healthai-api/pkgs/container/healthai-api) on every tagged release.

```bash
docker pull ghcr.io/healthai-corpo/healthai-api:latest
```

> The container runs as the unprivileged `node` user and must have outbound access to your Zitadel instance to fetch JWKS keys on startup.

### Development image

```bash
docker build -f Dockerfile.dev -t healthai-api-dev .
docker run -p 3001:3001 -v $(pwd):/app healthai-api-dev
```

---

## Scripts

```bash
# Development
npm run start:dev          # Watch mode (auto-reload)
npm run start:debug        # Debug + watch

# Build & production
npm run build              # Compile TypeScript → dist/
npm run start:prod         # Run compiled output

# Database migrations
npm run migration:generate # Generate migration from entity changes
npm run migration:create   # Create empty migration file
npm run migration:run      # Apply all pending migrations
npm run migration:revert   # Roll back last migration
npm run seed:dev-account   # Create dev user (development only)

# Tests
npm run test               # Unit tests
npm run test:cov           # Unit tests + coverage report
npm run test:e2e           # End-to-end tests

# Code quality
npm run lint               # ESLint (auto-fix)
npm run format             # Prettier
```

---

## Project structure

```
src/
├── auth/                        # Authentication
│   ├── guards/                  # JwtAuthGuard (global)
│   ├── decorators/              # @Public() — bypass JWT guard
│   ├── auth.controller.ts       # GET /auth/validate (Traefik forward-auth)
│   ├── auth.service.ts          # Token validation + role extraction
│   └── jwt.strategy.ts          # Passport strategy — JWKS / RS256
│
├── config/                      # Joi env validation schema
├── common/                      # CORS util, global HTTP exception filter
├── database/                    # TypeORM datasource + migrations
├── health/                      # GET /health (Terminus)
│
└── modules/
    ├── utilisateur/             # Users
    ├── aliment/                 # Food catalog
    ├── exercice/                # Exercise catalog
    ├── log-aliment/             # Food journal
    ├── log-seance/              # Training sessions
    ├── log-sante/               # Health metrics
    ├── profil-sante/            # Health profiles
    ├── etl-log/                 # ETL pipeline logs
    └── datasets/
        ├── recommandations-regime/
        └── historique-seance-exercice/
```

---

## Zitadel setup

1. Create an **API application** inside your Zitadel project
2. Set `JWT_AUDIENCE` to the application's **Client ID**
3. Set `JWT_ISSUER` and `ZITADEL_DOMAIN` to your instance URL (check the **URLs** tab in the app settings)
4. Create a **Web / SPA application** (PKCE) for your frontend in the same project — tokens it requests will carry the API audience automatically
5. For machine-to-machine callers, create a **Service User** in Zitadel

The API validates tokens at `{ZITADEL_DOMAIN}/oauth/v2/keys` (JWKS endpoint).

---

<div align="center">
  <sub>Part of the <strong>HealthAI Coach</strong> platform · Built with NestJS & Zitadel</sub>
</div>

# HealthAI API

REST API for the HealthAI Coach platform — user management, health data, and AI datasets.

Built with NestJS 11, TypeScript, TypeORM, and PostgreSQL. Authentication is fully delegated to **Zitadel** (OIDC / RS256 JWT).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (Express) |
| Language | TypeScript 5.7 |
| Database | PostgreSQL 15 via TypeORM 0.3 |
| Identity | Zitadel (OIDC — RS256 JWKS validation) |
| Validation | class-validator · class-transformer · Joi |
| Security | Helmet · @nestjs/throttler |
| Docs | Swagger / OpenAPI at `/doc` |
| Monitoring | NestJS Terminus (`/health`) |
| Tests | Jest · Supertest |

---

## Security model

```
Request
  ↓
Rate limiter      — 100 req / 60 s per IP (configurable)
  ↓
Zitadel JWT       — RS256, issuer + audience validated against JWKS
  ↓
Endpoint
```

The API never issues tokens. Users authenticate through Zitadel and send the resulting Bearer token on every request. The API validates the token locally using Zitadel's public JWKS endpoint — no network call per request after the first fetch (keys are cached 10 min).

CORS restricts browser-based calls to the origins listed in `FRONTEND_ORIGIN`.

---

## Getting started

### Prerequisites

- Node.js 20+
- A running PostgreSQL instance
- A Zitadel project with an API application configured

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — see [Environment variables](#environment-variables) below.

### 3. Run database migrations

```bash
npm run migration:run
```

### 4. (Optional) seed a dev user

```bash
npm run seed:dev-account
```

Requires `DEV_DEFAULT_USER_EMAIL` and `DEV_DEFAULT_USER_PASSWORD` to be set. Refuses to run in production.

### 5. Start

```bash
npm run start:dev        # watch mode
# → http://localhost:3001
# → http://localhost:3001/doc  (Swagger UI)
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ZITADEL_DOMAIN` | Yes | Your Zitadel instance URL |
| `JWT_ISSUER` | Yes | Must match the issuer claim in Zitadel tokens (usually same as `ZITADEL_DOMAIN`) |
| `JWT_AUDIENCE` | Yes | Client ID of your NestJS API app in Zitadel |
| `FRONTEND_ORIGIN` | Yes | Comma-separated list of allowed CORS origins |
| `THROTTLE_TTL` | No | Rate limit window in ms (default: `60000`) |
| `THROTTLE_LIMIT` | No | Max requests per window per IP (default: `100`) |
| `PORT` | No | HTTP port (default: `3001`) |
| `NODE_ENV` | No | `development` / `production` / `test` |
| `DEV_DEFAULT_USER_EMAIL` | No | Dev seed account email |
| `DEV_DEFAULT_USER_PASSWORD` | No | Dev seed account password (min 8 chars) |

See `.env.example` for a ready-to-copy template with the real Zitadel URLs.

---

## API endpoints

Full interactive documentation with request/response schemas is available at `/doc` (Swagger UI) once the server is running.

| Group | Base path | Notes |
|---|---|---|
| Auth | `GET /auth/validate` | Traefik forward-auth proxy — validates Bearer token, injects `X-User-Id` |
| Health | `GET /health` | Public — database ping |
| Users | `CRUD /utilisateurs` | |
| Foods | `CRUD /aliments` | |
| Exercises | `CRUD /exercices` | |
| Food logs | `CRUD /log-aliment` | |
| Session logs | `CRUD /log-seance` | |
| Health logs | `CRUD /log-sante` | |
| Health profiles | `CRUD /profil-sante` | One per user |
| AI dataset — diets | `CRUD /datasets/recommandations-regime` | Pre-cleaned data for AI |
| AI dataset — sessions | `CRUD /datasets/historique-seance-exercice` | Pre-cleaned data for AI |

All routes except `GET /health` require a valid Zitadel Bearer token.

---

## Docker

```bash
# Build
docker build -t healthai-api .

# Run (pass all required env vars)
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e ZITADEL_DOMAIN="http://mspr-zitadel-a7c405-158-220-101-254.traefik.me" \
  -e JWT_ISSUER="http://mspr-zitadel-a7c405-158-220-101-254.traefik.me" \
  -e JWT_AUDIENCE="370596489371582467" \
  -e FRONTEND_ORIGIN="http://localhost:3000" \
  healthai-api
```

The container must have outbound access to your Zitadel instance to fetch JWKS keys on startup.

---

## Scripts

```bash
# Development
npm run start:dev          # watch mode
npm run start:debug        # debug + watch

# Build & production
npm run build
npm run start:prod

# Database
npm run migration:generate # generate migration from entity changes
npm run migration:create   # create an empty migration file
npm run migration:run      # apply pending migrations
npm run migration:revert   # roll back last migration
npm run seed:dev-account   # create dev user (development only)

# Tests
npm run test               # unit tests
npm run test:cov           # unit tests + coverage report
npm run test:e2e           # end-to-end tests

# Code quality
npm run lint               # ESLint (auto-fix)
npm run format             # Prettier
```

---

## Project structure

```
src/
├── auth/                  # Zitadel JWT strategy, guards, Traefik validate endpoint
│   ├── guards/            # JwtAuthGuard
│   └── decorators/        # @Public()
├── config/                # Joi env validation schema
├── common/                # CORS util, global exception filter
├── database/              # TypeORM datasource, migrations
├── health/                # Health check controller
└── modules/
    ├── utilisateur/
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

## Zitadel setup

1. Create an **API application** inside your Zitadel project
2. Set `JWT_AUDIENCE` to the application's **Client ID**
3. Set `JWT_ISSUER` and `ZITADEL_DOMAIN` to your instance URL (check the **URLs** tab in the app settings)
4. Create a **Web / SPA application** (PKCE) for your frontend in the same project — tokens it requests will carry the API audience automatically
5. For machine-to-machine callers, create a **Service User** in Zitadel

The API validates tokens at `{ZITADEL_DOMAIN}/oauth/v2/keys` (JWKS).

go# HealthAI API - Features

API REST NestJS pour la gestion de données de santé et bien-être avec TypeScript, TypeORM et PostgreSQL.

---

## 🔐 Authentification & Sécurité

### JWT Authentication
- `POST /auth/login` - Authentification email/password, retourne un JWT
- Token configurable (expiration, issuer, audience)
- Hash bcrypt pour les mots de passe

### Sécurité Multi-Couches
- **API Key Guard** (`x-api-key` header) - Sécurité globale, timing-safe
- **Client ID Guard** (`x-client-id` header) - Validation frontend
- **JWT Guard** - Protection routes avec Passport JWT
- `@Public()` decorator pour routes publiques

---

## 👤 Gestion Utilisateurs

### CRUD Complet
- Création, lecture, mise à jour, suppression
- Email unique, mots de passe hashés
- Relations avec logs et profil santé

### Script Dev
- `npm run seed:dev-account` - Crée/met à jour compte dev
- Configurable via env (`DEV_DEFAULT_USER_EMAIL`, `DEV_DEFAULT_USER_PASSWORD`)
- Refuse l'exécution en production

---

## 🍎 Modules Métier

### Aliments (`/aliments`)
- CRUD catalogue aliments
- Infos nutritionnelles (calories, macros, micros)
- Catégories et types de repas

### Exercices (`/exercices`)
- CRUD catalogue exercices
- Type, muscle ciblé, équipement, difficulté
- Instructions détaillées

### Logs Alimentaires (`/log-aliments`)
- Journal alimentaire par utilisateur
- Quantités, types de repas, dates
- Relations Utilisateur ↔ Aliment

### Logs Séances (`/log-seances`)
- Journal d'entraînement
- Durée, calories brûlées, BPM
- Relations Utilisateur ↔ Exercice

### Logs Santé (`/log-santes`)
- Métriques santé quotidiennes
- Poids, IMC, % gras, BPM, pas, sommeil, hydratation

### Profils Santé (`/profil-sante`)
- Profil 1:1 avec utilisateur
- Objectifs, restrictions, allergies, maladies
- Niveau activité et fréquence entraînement

---

## 🤖 Modules Datasets IA

### Recommandations Régime (`/datasets/recommandations-regime`)
- CRUD dataset recommandations alimentaires
- Données pré-nettoyées pour IA
- Pas de logique ETL dans l'API

### Historique Séances (`/datasets/historique-seance-exercice`)
- CRUD dataset historique exercices
- Données pré-nettoyées pour IA
- Pas de logique ETL dans l'API

---

## 🗄️ Base de Données

### TypeORM + PostgreSQL
- 9 entités avec relations
- Migrations automatisées
- Index sur colonnes clés (dates, types, email)
- Contraintes CASCADE/RESTRICT

### Commandes Migration
- `npm run migration:generate` - Génère depuis entités
- `npm run migration:run` - Applique migrations
- `npm run migration:revert` - Rollback

---

## 🏥 Health Monitoring

- `GET /health` - Health check public
- Ping database (timeout 300ms)
- NestJS Terminus + TypeORM indicator

---

## 📖 Documentation API

### Swagger/OpenAPI
- Interface interactive sur `/doc`
- Définitions sécurité (Bearer, API Key, Client ID)
- Documentation complète de tous les endpoints
- Schémas DTO avec validation

---

## ⚙️ Configuration

### Variables Requises
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` (min 32 chars)
- `JWT_ISSUER`, `JWT_AUDIENCE`
- `API_KEY` (min 32 chars)
- `FRONTEND_ORIGIN`
- `FRONTEND_CLIENT_ID` (min 8 chars)

### Variables Optionnelles
- `NODE_ENV` (default: development)
- `PORT` (default: 3001)
- `JWT_EXPIRES_IN` (default: 3600)

---

## 🛠️ Développement

### Scripts
- `npm run start:dev` - Mode watch
- `npm run build` - Build production
- `npm run test` - Tests unitaires
- `npm run test:e2e` - Tests E2E
- `npm run lint` - ESLint
- `npm run format` - Prettier

### Validation & Qualité
- Validation globale (class-validator)
- Whitelist mode (forbid non-whitelisted)
- Transformation automatique types
- ESLint + Prettier

---

## 🌐 CORS & Sécurité

- Origins configurables (multi-origin support)
- Headers autorisés : Content-Type, Authorization, x-api-key, x-client-id
- Méthodes : GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
- Exception filter global
- Validation Joi pour env vars

---

## 🐳 Déploiement

- Dockerfile inclus
- Support production (`npm run start:prod`)
- Node.js 20+ requis
- Configuration par environnement

---

## 📊 Stack Technique

**Core:** NestJS 11.x, TypeScript 5.7.x, Express  
**Database:** PostgreSQL, TypeORM 0.3.x  
**Auth:** Passport JWT, bcrypt  
**Validation:** class-validator, class-transformer, Joi  
**Docs:** Swagger/OpenAPI  
**Monitoring:** Terminus  
**Tests:** Jest, Supertest

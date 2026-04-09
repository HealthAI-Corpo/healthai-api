# 📖 HealthAI API - Documentation

## Accès à la documentation

**Swagger UI:** `http://localhost:3001/doc`

Documentation interactive complète avec tous les endpoints, schémas et possibilité de tester les requêtes.

---


## 🔐 Authentification

### Sécurité Multi-Couches

L'API utilise 3 niveaux de sécurité :

1. **API Key** (header `x-api-key`) - Globale, requise sur toutes les routes
2. **Client ID** (header `x-client-id`) - Validation frontend
3. **JWT Bearer Token** - Authentification utilisateur

### Obtenir un JWT Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Utilisation du token:**
```http
GET /utilisateurs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
x-api-key: your-api-key
x-client-id: your-client-id
```

---

## 📋 Endpoints disponibles

### Authentification
- `POST /auth/login` - Connexion utilisateur (retourne JWT)

### Health Check
- `GET /health` - Status de l'API et DB (public, pas d'auth requise)

### Utilisateurs
- `POST /utilisateurs` - Créer un utilisateur
- `GET /utilisateurs` - Lister tous les utilisateurs
- `GET /utilisateurs/:id` - Récupérer un utilisateur
- `PATCH /utilisateurs/:id` - Modifier un utilisateur
- `DELETE /utilisateurs/:id` - Supprimer un utilisateur (cascade sur logs/profil)

### Aliments
- `POST /aliments` - Créer un aliment
- `GET /aliments` - Lister tous les aliments
- `GET /aliments/:id` - Récupérer un aliment
- `PATCH /aliments/:id` - Modifier un aliment
- `DELETE /aliments/:id` - Supprimer un aliment (RESTRICT si référencé)

### Exercices
- `POST /exercices` - Créer un exercice
- `GET /exercices` - Lister tous les exercices
- `GET /exercices/:id` - Récupérer un exercice
- `PATCH /exercices/:id` - Modifier un exercice
- `DELETE /exercices/:id` - Supprimer un exercice (RESTRICT si référencé)

### Logs Alimentaires
- `POST /logs-aliment` - Créer un log alimentaire
- `GET /logs-aliment` - Lister tous les logs
- `GET /logs-aliment/:id` - Récupérer un log
- `PATCH /logs-aliment/:id` - Modifier un log
- `DELETE /logs-aliment/:id` - Supprimer un log

### Logs Séances
- `POST /logs-seance` - Créer un log de séance
- `GET /logs-seance` - Lister tous les logs
- `GET /logs-seance/:id` - Récupérer un log
- `PATCH /logs-seance/:id` - Modifier un log
- `DELETE /logs-seance/:id` - Supprimer un log

### Logs Santé
- `POST /logs-sante` - Créer un log santé
- `GET /logs-sante` - Lister tous les logs
- `GET /logs-sante/:id` - Récupérer un log
- `PATCH /logs-sante/:id` - Modifier un log
- `DELETE /logs-sante/:id` - Supprimer un log

### Profils Santé
- `POST /profils-sante` - Créer un profil santé
- `GET /profils-sante` - Lister tous les profils
- `GET /profils-sante/:id` - Récupérer un profil
- `PATCH /profils-sante/:id` - Modifier un profil
- `DELETE /profils-sante/:id` - Supprimer un profil

### Datasets IA

#### Recommandations Régimes
- `POST /datasets/recommandations-regime` - Créer une entrée
- `GET /datasets/recommandations-regime` - Lister toutes les entrées
- `GET /datasets/recommandations-regime/:id` - Récupérer une entrée
- `PATCH /datasets/recommandations-regime/:id` - Modifier une entrée
- `DELETE /datasets/recommandations-regime/:id` - Supprimer une entrée

#### Historique Séances Exercices
- `POST /datasets/historique-seance-exercice` - Créer une entrée
- `GET /datasets/historique-seance-exercice` - Lister toutes les entrées
- `GET /datasets/historique-seance-exercice/:id` - Récupérer une entrée
- `PATCH /datasets/historique-seance-exercice/:id` - Modifier une entrée
- `DELETE /datasets/historique-seance-exercice/:id` - Supprimer une entrée

---

## 🎯 Tags Swagger

Les endpoints sont organisés par tags :

- **auth** - Authentification
- **health** - Health checks
- **utilisateurs** - Gestion utilisateurs
- **aliments** - Catalogue aliments
- **exercices** - Catalogue exercices
- **log-aliments** - Journal alimentaire
- **log-seances** - Journal entraînement
- **log-santes** - Métriques santé
- **profil-sante** - Profils santé
- **datasets-recommandations** - Dataset IA recommandations
- **datasets-exercices** - Dataset IA exercices

---

## 📊 Codes de réponse HTTP

### Succès
- `200 OK` - Requête réussie (GET, PATCH)
- `201 Created` - Ressource créée (POST)
- `204 No Content` - Suppression réussie (DELETE)

### Erreurs Client
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Authentification échouée
- `404 Not Found` - Ressource introuvable
- `409 Conflict` - Suppression impossible (référence existante)

### Erreurs Serveur
- `500 Internal Server Error` - Erreur serveur
- `503 Service Unavailable` - Service indisponible (health check)

---

## 💡 Exemples d'utilisation

### Créer un utilisateur
```http
POST /utilisateurs
Authorization: Bearer <token>
x-api-key: <api-key>
x-client-id: <client-id>
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "motDePasseHash": "$2b$10$hashedpassword...",
  "dateNaissance": "1990-01-15",
  "genre": "Homme",
  "typeAbonnement": "Premium"
}
```

### Créer un log alimentaire
```http
POST /logs-aliment
Authorization: Bearer <token>
x-api-key: <api-key>
x-client-id: <client-id>
Content-Type: application/json

{
  "idUtilisateur": 1,
  "idAliment": 5,
  "logDate": "2026-04-07T12:30:00Z",
  "typeRepas": "Déjeuner",
  "quantiteG": 150.0,
  "unite": "g"
}
```

### Créer un profil santé
```http
POST /profils-sante
Authorization: Bearer <token>
x-api-key: <api-key>
x-client-id: <client-id>
Content-Type: application/json

{
  "idUtilisateur": 1,
  "poidsKg": 75.5,
  "tailleCm": 175,
  "imc": 24.6,
  "niveauActivite": "Modéré",
  "typeMaladie": "Diabète type 2",
  "severite": "Légère",
  "restrictionsAlimentaires": "Sans sucre ajouté",
  "allergies": "Arachides, fruits de mer",
  "objectifPrincipal": "Perte de poids",
  "experienceSportive": "Intermédiaire",
  "frequenceEntrainement": 4
}
```

---

## 🔧 Configuration requise

Assurez-vous que votre fichier `.env` contient :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/healthai

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_ISSUER=healthai-api
JWT_AUDIENCE=healthai-client
JWT_EXPIRES_IN=3600

# API Security
API_KEY=your-api-key-min-32-chars
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_CLIENT_ID=healthai-frontend-id

# Server
PORT=3001
NODE_ENV=development
```

---

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Exécuter les migrations
npm run migration:run

# Créer un compte dev (optionnel)
npm run seed:dev-account

# Démarrer en mode développement
npm run start:dev

# Accéder à Swagger
open http://localhost:3001/doc
```

---

## 📝 Notes importantes

### Relations CASCADE/RESTRICT

- **Suppression utilisateur** → CASCADE sur tous ses logs et profil santé
- **Suppression aliment/exercice** → RESTRICT si référencé dans des logs

### Datasets IA

Les endpoints `/datasets/*` exposent des données pré-nettoyées pour l'IA en CRUD simple :
- ❌ Pas de logique ETL
- ❌ Pas d'import CSV
- ❌ Pas de transformation avancée
- ✅ CRUD basique uniquement

### Validation automatique

Tous les DTO sont validés avec class-validator :
- Champs requis
- Types corrects
- Formats email/date
- Plages de valeurs (BPM 0-300, poids 0-999kg, etc.)

---

**Documentation générée automatiquement avec Swagger/OpenAPI** 🎉

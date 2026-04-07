# Guide d'Intégration HealthAI API - NestJS + TypeORM

## 📋 Récapitulatif du Code Généré

### ✅ **Structure complète créée** :

```
src/modules/
├── utilisateur/
│   ├── dto/
│   │   ├── create-utilisateur.dto.ts
│   │   └── update-utilisateur.dto.ts
│   ├── entities/
│   │   └── utilisateur.entity.ts
│   ├── utilisateur.controller.ts
│   ├── utilisateur.service.ts
│   └── utilisateur.module.ts
├── aliment/
│   ├── dto/
│   ├── entities/
│   ├── aliment.controller.ts
│   ├── aliment.service.ts
│   └── aliment.module.ts
├── exercice/
│   ├── dto/
│   ├── entities/
│   ├── exercice.controller.ts
│   ├── exercice.service.ts
│   └── exercice.module.ts
├── log-aliment/
│   ├── dto/
│   ├── entities/
│   ├── log-aliment.controller.ts
│   ├── log-aliment.service.ts
│   └── log-aliment.module.ts
├── log-seance/
│   ├── dto/
│   ├── entities/
│   ├── log-seance.controller.ts
│   ├── log-seance.service.ts
│   └── log-seance.module.ts
├── log-sante/
│   ├── dto/
│   ├── entities/
│   ├── log-sante.controller.ts
│   ├── log-sante.service.ts
│   └── log-sante.module.ts
├── profil-sante/
│   ├── dto/
│   ├── entities/
│   ├── profil-sante.controller.ts
│   ├── profil-sante.service.ts
│   └── profil-sante.module.ts
└── datasets/
    ├── recommandations-regime/
    │   ├── dto/
    │   ├── entities/
    │   ├── recommandations-regime.controller.ts
    │   ├── recommandations-regime.service.ts
    │   └── recommandations-regime.module.ts
    └── historique-seance-exercice/
        ├── dto/
        ├── entities/
        ├── historique-seance-exercice.controller.ts
        ├── historique-seance-exercice.service.ts
        └── historique-seance-exercice.module.ts

src/database/
├── migrations/
│   └── 1775545786-CreateHealthAISchema.ts
├── typeorm.config.ts (mis à jour)
└── typeorm.datasource.ts (mis à jour)
```

---

## 🚀 Étapes d'Intégration

### **1. Importer les modules dans AppModule**

Éditez `src/app.module.ts` :

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildTypeOrmOptions } from './database/typeorm.config';

// Modules métier
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { AlimentModule } from './modules/aliment/aliment.module';
import { ExerciceModule } from './modules/exercice/exercice.module';
import { LogAlimentModule } from './modules/log-aliment/log-aliment.module';
import { LogSeanceModule } from './modules/log-seance/log-seance.module';
import { LogSanteModule } from './modules/log-sante/log-sante.module';
import { ProfilSanteModule } from './modules/profil-sante/profil-sante.module';

// Modules datasets
import { RecommandationsRegimeModule } from './modules/datasets/recommandations-regime/recommandations-regime.module';
import { HistoriqueSeanceExerciceModule } from './modules/datasets/historique-seance-exercice/historique-seance-exercice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
    // Modules métier
    UtilisateurModule,
    AlimentModule,
    ExerciceModule,
    LogAlimentModule,
    LogSeanceModule,
    LogSanteModule,
    ProfilSanteModule,
    // Modules datasets
    RecommandationsRegimeModule,
    HistoriqueSeanceExerciceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

### **2. Exécuter la migration**

#### **Générer le build** :
```bash
npm run build
```

#### **Exécuter les migrations** :
```bash
npm run migration:run
```

#### **Vérifier le statut** :
```bash
npx typeorm-ts-node-commonjs migration:show -d src/database/typeorm.datasource.ts
```

---

### **3. Tester l'API**

#### **Démarrer le serveur** :
```bash
npm run start:dev
```

#### **Accéder à Swagger** :
Ouvrez votre navigateur à : `http://localhost:3001/doc`

---

## 📚 Endpoints Disponibles

### **Entités métier** :

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Utilisateurs** | `GET/POST/PATCH/DELETE /utilisateurs` | Gestion des utilisateurs |
| **Aliments** | `GET/POST/PATCH/DELETE /aliments` | Catalogue d'aliments |
| **Exercices** | `GET/POST/PATCH/DELETE /exercices` | Catalogue d'exercices |
| **Logs Aliment** | `GET/POST/PATCH/DELETE /logs-aliment` | Journal alimentaire |
| **Logs Séance** | `GET/POST/PATCH/DELETE /logs-seance` | Journal d'entraînement |
| **Logs Santé** | `GET/POST/PATCH/DELETE /logs-sante` | Métriques de santé |
| **Profils Santé** | `GET/POST/PATCH/DELETE /profils-sante` | Profils utilisateurs |

### **Datasets IA** (CRUD simple) :

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Recommandations Régime** | `GET/POST/PATCH/DELETE /datasets/recommandations-regime` | Dataset recommandations |
| **Historique Séance Exercice** | `GET/POST/PATCH/DELETE /datasets/historique-seance-exercice` | Dataset historiques |

---

## 🔐 Relations et Contraintes

### **Relations Métier** :

1. **Utilisateur → LogAliment** (1:N, CASCADE DELETE)
2. **Utilisateur → LogSeance** (1:N, CASCADE DELETE)
3. **Utilisateur → LogSante** (1:N, CASCADE DELETE)
4. **Utilisateur → ProfilSante** (1:1, CASCADE DELETE, UNIQUE)
5. **Aliment → LogAliment** (1:N, RESTRICT DELETE)
6. **Exercice → LogSeance** (1:N, RESTRICT DELETE)

### **Datasets** :
- ✅ Aucune relation avec les tables métier
- ✅ CRUD simple et indépendant

---

## 📊 Index Créés

Les index suivants sont automatiquement créés par la migration :

```sql
-- Métier
IDX_utilisateur_email
IDX_aliment_type_repas
IDX_exercice_type_exercice
IDX_log_aliment_log_date
IDX_log_aliment_type_repas
IDX_log_seance_log_date
IDX_log_seance_type_seance
IDX_log_sante_date_log
IDX_profil_sante_type_maladie
IDX_profil_sante_id_utilisateur

-- Datasets
IDX_dataset_recommandations_regime_type_maladie
IDX_dataset_historique_seance_exercice_type_sport
```

---

## ⚙️ Scripts npm Disponibles

```bash
# Migrations
npm run migration:create     # Créer une migration vide
npm run migration:generate   # Générer depuis changements entités
npm run migration:run        # Exécuter les migrations
npm run migration:revert     # Annuler la dernière migration

# Développement
npm run start:dev            # Mode développement avec watch
npm run build                # Build production
npm run lint                 # Linter le code

# Tests
npm run test                 # Tests unitaires
npm run test:e2e            # Tests end-to-end
npm run test:cov            # Coverage
```

---

## 🧪 Exemples d'Utilisation

### **Créer un utilisateur** :
```bash
POST /utilisateurs
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "dateDeNaissance": "1990-05-15",
  "genre": "Homme",
  "motDePasseHash": "SecureHash123!"
}
```

### **Créer un log aliment** :
```bash
POST /logs-aliment
Content-Type: application/json

{
  "logDate": "2024-01-15T12:30:00Z",
  "typeRepas": "Déjeuner",
  "quantiteG": 150.5,
  "unite": "g",
  "idUtilisateur": 1,
  "idAliment": 1
}
```

### **Créer une recommandation régime (dataset)** :
```bash
POST /datasets/recommandations-regime
Content-Type: application/json

{
  "idDatasetRecommandationsRegime": "REC001",
  "age": 45,
  "sexe": "Homme",
  "poidsKg": 80.5,
  "tailleCm": 175,
  "typeMaladie": "Diabète type 2",
  "recommandationRegime": "Régime méditerranéen"
}
```

---

## 🔧 Configuration Base de Données

Assurez-vous que votre `.env` contient :

```env
DATABASE_URL=postgresql://username:password@localhost:5432/healthai_db
```

---

## ✅ Validation et Sécurité

- ✅ **Validation automatique** via class-validator
- ✅ **Transformation des types** via class-transformer
- ✅ **Documentation Swagger** complète
- ✅ **Gestion des erreurs** avec NotFoundException
- ✅ **Foreign keys** avec CASCADE/RESTRICT appropriés
- ✅ **Index** pour optimisation des requêtes

---

## 🎯 Ce qui est INCLUS

✅ 9 entités TypeORM complètes
✅ 18 DTOs avec validation
✅ 9 services CRUD
✅ 9 controllers REST
✅ 9 modules NestJS
✅ 1 migration TypeORM complète
✅ Index et contraintes
✅ Relations métier
✅ Documentation Swagger

---

## 🚫 Ce qui n'est PAS inclus (volontairement)

❌ Logique ETL
❌ Import CSV
❌ Transformation de données
❌ Nettoyage de datasets
❌ Logique métier avancée dans les datasets

**Rappel** : Les tables `dataset_*` sont exposées en CRUD simple uniquement.

---

## 🐛 Rollback en cas d'erreur

Si la migration échoue :

```bash
npm run migration:revert
```

Cela annulera toutes les modifications de la dernière migration.

---

## 📝 Notes Techniques

1. **synchronize: false** : Les migrations contrôlent le schéma DB
2. **migrationsRun: true** : Auto-exécution au démarrage (optionnel)
3. **eager: false** : Pas de chargement automatique des relations
4. **cascade: true** : Suppression en cascade des logs utilisateur
5. **onDelete: RESTRICT** : Protection des aliments/exercices référencés

---

## 🎉 Prochaines Étapes

1. ✅ Vérifier que tous les modules sont importés dans `AppModule`
2. ✅ Exécuter `npm run migration:run`
3. ✅ Démarrer l'application avec `npm run start:dev`
4. ✅ Tester les endpoints via Swagger (`/doc`)
5. ✅ Créer des données de test
6. ✅ Intégrer avec votre frontend

---

**Votre API CRUD HealthAI est prête à l'emploi ! 🚀**

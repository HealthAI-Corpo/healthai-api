go# HealthAI API Features

## Overview
HealthAI API is a NestJS-based REST API for health and wellness data management, built with TypeScript, TypeORM, and PostgreSQL.

---

## Core Features

### 1. Authentication & Authorization

#### JWT-Based Authentication
- **Login endpoint** (`POST /auth/login`)
  - Email and password authentication
  - Returns JWT access token
  - Configurable token expiration
  - JWT issuer and audience validation
  - Bcrypt password hashing

#### Multi-Layer Security
- **API Key Guard** (`x-api-key` header)
  - Global application-level security
  - Timing-safe comparison to prevent timing attacks
  - Required on all non-public endpoints
  
- **Client ID Guard** (`x-client-id` header)
  - Frontend client verification
  - Validates against configured frontend client ID
  - Timing-safe comparison
  
- **JWT Guard**
  - Passport-based JWT strategy
  - Protects authenticated routes
  - User validation from JWT payload

#### Public Routes
- `@Public()` decorator to bypass authentication
- Health check endpoint is public

---

### 2. User Management

#### User Entity
- UUID-based primary keys
- Email (unique identifier)
- Hashed password storage
- PostgreSQL persistence via TypeORM

#### Development Seeding
- **Dev account seed script** (`npm run seed:dev-account`)
  - Creates or updates default development account
  - Configurable via environment variables
  - Production-safe (refuses to run in production)
  - Uses `DEV_DEFAULT_USER_EMAIL` and `DEV_DEFAULT_USER_PASSWORD`

---

### 3. ETL (Extract, Transform, Load)

#### Scheduled ETL Jobs
- **Cron-based scheduling**
  - Default schedule: Daily at midnight (`0 0 * * *`)
  - Dynamic cron expression updates
  - Automatic job management on module initialization

#### ETL Management API
- **Get schedule** (`GET /etl/schedule`)
  - Returns current cron expression
  
- **Update schedule** (`PATCH /etl/schedule`)
  - Runtime cron expression modification
  - Validation of cron expressions
  - Stops and recreates job with new schedule
  - BadRequest response for invalid expressions

#### ETL Service
- Scheduler registry integration
- Job lifecycle management (create, start, stop, delete)
- Placeholder for ETL task execution
- Named cron job (`etl-daily-job`)

---

### 4. Health Monitoring

#### Health Check Endpoint
- **Readiness check** (`GET /health`)
  - Public endpoint (no authentication required)
  - Database ping check with 300ms timeout
  - Uses NestJS Terminus module
  - TypeORM health indicator

---

### 5. API Documentation

#### Swagger/OpenAPI Integration
- **Interactive API documentation** at `/doc`
- Swagger UI for API exploration
- Security definitions:
  - Bearer authentication (JWT)
  - API key header (`x-api-key`)
  - Client ID header (`x-client-id`)
- Complete API specification
- Title: "MSPRHealthAI API"
- Description: REST API for authentication and health data

---

### 6. Database Integration

#### TypeORM with PostgreSQL
- **Entity management**
  - User entity with migrations support
  - UUID primary keys
  - Relationship mapping

#### Migration System
- **Migration scripts:**
  - `npm run migration:generate` - Auto-generate from entity changes
  - `npm run migration:create` - Create empty migration file
  - `npm run migration:run` - Apply pending migrations
  - `npm run migration:revert` - Rollback last migration
- Dedicated TypeORM DataSource configuration
- Timestamp-based migration naming

---

### 7. Module Structure

The API is organized into specialized modules:

#### Admin Module
- Administrative functionality module
- Route prefix: `/admin`

#### Foods Module
- Food and nutrition data management
- Route prefix: `/foods`

#### Exercises Module
- Exercise tracking and management
- Route prefix: `/exercises`

#### Metrics Module
- Metrics and analytics
- Route prefix: `/metrics`

#### Exports Module
- Data export functionality
- Route prefix: `/exports`

#### Users Module
- User data management
- Route prefix: `/users`

---

### 8. Cross-Cutting Features

#### CORS Configuration
- Configurable allowed origins via environment variables
- Multiple origin support (comma-separated)
- Allowed methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
- Custom headers support:
  - Content-Type
  - Authorization
  - x-api-key
  - x-client-id

#### Global Validation
- **Input validation pipeline**
  - Class-validator integration
  - Whitelist mode (strips unknown properties)
  - Forbid non-whitelisted properties
  - Automatic type transformation
  - DTO-based request validation

#### Exception Handling
- Global HTTP exception filter
- Standardized error responses
- Centralized error formatting

#### Configuration Management
- **Environment-based configuration**
  - Multiple env file support (`.env.local`, `.env`)
  - Global configuration module
  - Joi-based validation schema
  - Required variables:
    - `DATABASE_URL` (PostgreSQL connection)
    - `JWT_SECRET` (min 32 chars)
    - `JWT_ISSUER` and `JWT_AUDIENCE`
    - `API_KEY` (min 32 chars)
    - `FRONTEND_ORIGIN`
    - `FRONTEND_CLIENT_ID` (min 8 chars)
  - Optional variables with defaults:
    - `NODE_ENV` (default: development)
    - `PORT` (default: 3001)
    - `JWT_EXPIRES_IN` (default: 3600s)

---

### 9. Development Features

#### Testing Infrastructure
- **Jest test framework**
  - Unit tests (`npm run test`)
  - E2E tests (`npm run test:e2e`)
  - Test coverage (`npm run test:cov`)
  - Watch mode for TDD
  - Debug mode support

#### Code Quality
- **ESLint integration**
  - TypeScript linting
  - Auto-fix support
  - Prettier integration
  - Code formatting scripts

#### Development Workflow
- **Watch mode** (`npm run start:dev`)
  - Auto-reload on file changes
  - Debug mode available
  - Fast development iterations

---

### 10. Deployment Features

#### Docker Support
- Dockerfile included
- Container-ready application
- Production-optimized build

#### Production Mode
- **Production build** (`npm run build`)
- Optimized startup (`npm run start:prod`)
- Node.js 20+ requirement
- Environment-aware configuration

---

## Technology Stack

### Core Framework
- **NestJS 11.x** - Progressive Node.js framework
- **TypeScript 5.7.x** - Type-safe development
- **Express** - HTTP server

### Database
- **PostgreSQL** - Primary database
- **TypeORM 0.3.x** - ORM and migrations

### Authentication & Security
- **Passport** - Authentication middleware
- **passport-jwt** - JWT strategy
- **@nestjs/jwt** - JWT service
- **bcrypt** - Password hashing
- **crypto** (Node.js built-in) - Timing-safe comparisons

### Validation & Transformation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **Joi** - Environment configuration validation

### Scheduling
- **@nestjs/schedule** - Cron job management
- **cron** - Cron expression parsing and validation

### Documentation
- **@nestjs/swagger** - OpenAPI/Swagger generation

### Monitoring
- **@nestjs/terminus** - Health checks

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **ts-node** - TypeScript execution
- **Supertest** - API testing

---

## API Endpoints Summary

### Authentication
- `POST /auth/login` - User login, returns JWT token

### ETL Management
- `GET /etl/schedule` - Get current ETL cron schedule
- `PATCH /etl/schedule` - Update ETL cron schedule

### Health Monitoring
- `GET /health` - Database health check (public)

### Module Endpoints
- `/admin/*` - Admin operations
- `/users/*` - User management
- `/foods/*` - Food data
- `/exercises/*` - Exercise data
- `/metrics/*` - Analytics and metrics
- `/exports/*` - Data exports

### Documentation
- `GET /doc` - Swagger UI interface

---

## Security Features Summary

1. **Multi-layer authentication**
   - API key validation
   - Client ID verification
   - JWT bearer tokens

2. **Password security**
   - Bcrypt hashing (10 rounds)
   - Secure credential comparison

3. **CORS protection**
   - Origin whitelisting
   - Controlled header access

4. **Input validation**
   - DTO-based validation
   - Type safety
   - Whitelist mode

5. **Timing attack prevention**
   - Constant-time string comparison for secrets

6. **Environment validation**
   - Required security configurations
   - Minimum secret lengths enforced

---

## Future Expansion Points

Based on the module structure, the following features appear to be planned or in development:

- **Foods Module** - Nutrition tracking and food database
- **Exercises Module** - Workout and exercise logging
- **Metrics Module** - Health metrics and analytics
- **Admin Module** - Administrative controls
- **Exports Module** - Data export capabilities
- **Users Module** - Extended user profile management

---

*Last updated: Generated from codebase analysis*

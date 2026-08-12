---
name: nestjs-backend-architecture
description: Arquitectura de referencia para backend NestJS 10 y Prisma 5.22: contenedores Docker, validación de entorno con Joi, servidor seguro con Helmet y ValidationPipe, schema y seed de Prisma, scripts y configuración de calidad (ESLint, Jest, ts-jest). Úsala para crear, revisar o alinear módulos, configuraciones y pruebas del backend.
---

# Arquitectura de Referencia Backend: NestJS 10 & Prisma 5.22

Este documento contiene la estructura base completa, configuraciones de calidad de código, entornos de contenedorización y pruebas unitarias bajo los estándares técnicos solicitados.

---

## 1. Infraestructura de Contenedores (`compose.dev.yaml`)

```yaml
services:
  postgres-db:
    image: postgres:16-alpine
    container_name: nestjs_postgres_dev
    environment:
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password123
      POSTGRES_DB: nestjs_dev_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev_user -d nestjs_dev_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_dev_data:
    driver: local
```

---

## 2. Configuración y Validación de Entorno (`src/config/env.validation.ts`)

```typescript
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required().messages({
    'any.required': '⚠️ DATABASE_URL es mandatoria en las variables de entorno',
  }),
  THROTTLE_TTL: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(10),
});
```

---

## 3. Inicialización del Servidor Seguro (`src/main.ts`)

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Seguridad HTTP con Helmet
  app.use(helmet());

  // Configuración de CORS
  app.enableCors({
    origin: configService.get<string>('NODE_ENV') === 'production' ? 'https://tusitioweb.com' : '*',
    credentials: true,
  });

  // Tubería global de validación y transformación estricta
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor backend corriendo en puerto: ${port}`);
}
bootstrap();
```

---

## 4. Estructura de Datos y Semilla de Base de Datos (`prisma/`)

### `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### `prisma/seed.cjs`
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Ejecutando seeding de base de datos...');
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@backend.dev' },
    update: {},
    create: {
      email: 'admin@backend.dev',
      name: 'System Administrator',
    },
  });

  console.log(`✅ Base de datos sembrada. Usuario base: ${user.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 5. Gestión del Proyecto (`package.json`)

```json
{
  "name": "nestjs-10-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start:dev": "nest start --watch",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "node prisma/seed.cjs"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/throttler": "^5.0.0",
    "@prisma/client": "5.22.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "helmet": "^7.1.0",
    "joi": "^17.13.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.0",
    "eslint": "^10.0.0",
    "jest": "^30.0.0",
    "prisma": "5.22.0",
    "ts-jest": "^30.0.0",
    "ts-node": "^10.9.2",
    "typescript": "5.7.3",
    "typescript-eslint": "^8.0.0"
  }
}
```

---

## 6. Configuración de Calidad y Pruebas (`jest.config.json` & `eslint.config.js`)

### `jest.config.json`
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

### `eslint.config.js`
```javascript
const tsEslint = require('typescript-eslint');

module.exports = [
  ...tsEslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
```

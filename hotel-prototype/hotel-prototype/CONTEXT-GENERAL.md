# Hotel Management System - Centralized MVP (PEAN Stack)

## Proyecto General

Este repositorio contiene el desarrollo de un **Sistema de Gestión Hotelera Centralizado** para una cadena hotelera en expansión (Temuco, Pucón, Santiago, Viña del Mar). El objetivo es resolver problemas de sobreventa, tiempos de espera prolongados y gestión descentralizada mediante un sistema unificado.

**Stack Tecnológico:** PostgreSQL, Express.js, Angular, Node.js (PEAN).

**Arquitectura:** Clean Architecture con principios SOLID, DIP para acceso a datos, y monorepo Angular para frontend.

## Objetivos Arquitectónicos

### Backend (Node.js/Express/TypeScript)

- **Patrón de Capas Estricto:** Rutas → Controladores → Servicios → Repositorios.
- **Principios SOLID:** Responsabilidad Única (SRP), Inversión de Dependencias (DIP) en acceso a datos.
- **Tecnologías:** Express, TypeORM/Sequelize, pg, dotenv, cors, helmet, bcryptjs, jsonwebtoken, class-validator.

### Frontend (Angular Monorepo)

- **Dos Aplicaciones Independientes:** `portal-cliente` (público) y `panel-admin` (privado) por seguridad y SRP.
- **Librería Compartida:** `shared-models` para DTOs y contratos TypeScript.
- **Arquitectura:** Feature-based modules, lazy loading, standalone components.

### Database

- **Scripts SQL/DDL:** Migraciones y seeds en carpeta dedicada.
- **Tecnología:** PostgreSQL.

### Estructura Raíz

```
hotel-prototype/
├── backend/          # API REST con arquitectura de capas
├── database/         # Scripts SQL, migraciones, seeds
└── frontend/         # Monorepo Angular con 2 apps + librería
```

## Detalles de Implementación

### Backend

**Estructura de Capas:**

```
backend/src/
├── app.ts              # Configuración Express (middleware, CORS, etc.)
├── server.ts           # Punto de entrada (inicialización DB + servidor)
├── config/
│   ├── database.ts     # Configuración TypeORM (DataSource)
│   └── environment.ts  # Variables de entorno
├── controllers/        # Manejo de solicitudes HTTP
│   ├── reservas/
│   ├── frontdesk/
│   ├── admin/
│   └── operaciones/
├── services/           # Lógica de negocio
├── repositories/       # Acceso a datos (DIP principle)
├── models/
│   ├── entities/       # Entidades TypeORM
│   └── dtos/           # Data Transfer Objects
├── middleware/
│   ├── auth/           # Autenticación JWT
│   └── validation/     # Validación de entrada
├── routes/             # Definición de endpoints
├── utils/
│   ├── decorators/
│   ├── helpers/
│   ├── errors/         # AppError personalizado
│   └── interfaces/     # IRepository, IService
└── tests/              # Unit e integration tests
```

**Archivos Clave:**

- `package.json`: Dependencias (express, pg, typeorm, etc.)
- `tsconfig.json`: Configuración TypeScript con paths aliases
- `.env.example`: Variables de entorno (DB, JWT, etc.)
- `Dockerfile`: Contenedorización

### Frontend (Monorepo Angular)

**Estructura:**

```
frontend/
├── angular.json        # Configuración workspace
├── package.json        # Dependencias Angular
├── tsconfig.json       # Configuración TypeScript
└── projects/
    ├── portal-cliente/ # App pública (reservas, info hotel)
    ├── panel-admin/    # App privada (gestión, reportes)
    └── shared-models/  # Librería DTOs compartidos
```

**Características:**

- **portal-cliente:** Lazy loading, routing, componentes standalone.
- **panel-admin:** Módulos feature-based, guards de autenticación.
- **shared-models:** Interfaces TypeScript, DTOs, enums compartidos.

### Database

```
database/
├── migrations/         # Scripts DDL para evolución de esquema
├── seeds/              # Datos iniciales
└── scripts/            # Utilidades SQL
```

## Instrucciones de Desarrollo

### Backend

1. `cd backend && npm install`
2. Configurar `.env` basado en `.env.example`
3. `npm run dev` para desarrollo con hot-reload
4. `npm run build && npm start` para producción

### Frontend

1. `cd frontend && npm install`
2. `ng serve portal-cliente` para app pública
3. `ng serve panel-admin` para app privada
4. `ng build shared-models` para librería

### Database

- Usar scripts en `database/` para inicialización y migraciones.

## Prompt Inicial del Usuario

**Rol y Contexto:**
Eres un Arquitecto de Software Senior y experto en el stack PEAN (PostgreSQL, Express, Angular, Node.js). Vamos a inicializar el MVP de un Sistema de Gestión Hotelera Centralizado.
Tu objetivo en este momento NO es escribir la lógica de negocio, sino generar la estructura de carpetas y los archivos base (vacíos o con el boilerplate mínimo indispensable) para asegurar una arquitectura limpia desde el día uno.

**Reglas Arquitectónicas Inquebrantables:**

Backend (Node.js/Express/TypeScript): Debes aplicar un patrón estricto de capas: Rutas -> Controladores -> Servicios -> Repositorios.

Principios SOLID: La estructura debe fomentar el Principio de Responsabilidad Única (SRP) y la Inversión de Dependencias (DIP) en el acceso a datos (PostgreSQL).

Frontend (Angular): Debes estructurar el proyecto utilizando una arquitectura basada en características (Feature Modules o Standalone Components estructurados lógicamente) dividida en: Core, Shared y los módulos del MVP (Reservas, FrontDesk, Admin).

**Tarea Solicitada:**

Genera un script de Bash (comandos mkdir y touch) para crear el árbol de directorios y los archivos esenciales del Backend (ej. src/controllers, src/services, src/repositories, src/config/db.ts, src/app.ts).

Entrega los comandos de Angular CLI (ng generate ...) necesarios para levantar la estructura del Frontend (módulos, componentes principales y servicios de API).

Proporciona únicamente el código boilerplate mínimo para el archivo de entrada del servidor (app.ts o server.ts) y la configuración de conexión a PostgreSQL, utilizando inyección de dependencias si es posible.

Mantén la respuesta concisa, técnica y orientada a configurar un entorno de desarrollo escalable. No asumas librerías extrañas; usa lo estándar (Express, pg o TypeORM/Sequelize, cors, dotenv).

hazlo dentro de la carpeta ya existente "hotel-prototype", que dentro tiene una carpeta "backend", "frontend" (Falta uno para DataBase)

---

**Actualización Posterior:**

Rol y Contexto:
Eres un Arquitecto de Software Senior experto en el stack PEAN y en la arquitectura de Monorepos con Angular.
Me di cuenta de que el frontend debe dividirse en dos aplicaciones separadas (Portal de Clientes y Panel Administrativo) por razones de seguridad y separación de responsabilidades (SRP), pero queremos compartir los DTOs y modelos.

Reglas Arquitectónicas Inquebrantables:

Estructura de Carpetas Raíz: El proyecto debe tener tres carpetas principales en la raíz: backend/, database/ (para scripts SQL/DDL) y frontend/.

Angular Workspace (Monorepo): Dentro de la carpeta frontend/, NO debes generar una aplicación estándar. Debes generar un Angular Workspace vacío que contenga dos aplicaciones independientes y una librería compartida.

Tarea Solicitada:

Genera los comandos de Bash y de Angular CLI exactos para:

Crear la estructura raíz.

Inicializar un Angular Workspace vacío en la carpeta frontend (ng new frontend --create-application="false").

Generar la aplicación pública: ng generate application portal-cliente.

Generar la aplicación privada: ng generate application panel-admin.

Generar la librería compartida para DTOs: ng generate library shared-models.

Explica brevemente, a nivel técnico, cómo esta estructura de Monorepo en Angular garantiza una alta cohesión, evita la duplicación de contratos TypeScript y mantiene aislado el código administrativo del código público para evitar brechas de seguridad.

Mantén la respuesta estrictamente técnica, usando los comandos de terminal necesarios para levantar esta infraestructura desde cero.

## Estado Actual

- **Backend:** Estructura completa con boilerplate mínimo, capas implementadas, configuración TypeORM, variables de entorno.
- **Frontend:** Monorepo Angular con `portal-cliente`, `panel-admin` y `shared-models`.
- **Database:** Carpeta preparada para scripts SQL.

El proyecto está listo para desarrollo escalable siguiendo principios de Clean Architecture y seguridad por separación de responsabilidades.

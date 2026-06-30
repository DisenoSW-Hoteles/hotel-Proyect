# 🏛️ Arquitectura del Sistema — Hotel Management System

Documento de referencia técnica del backend. Resume el patrón arquitectónico
(**Arquitectura Limpia / Hexagonal**), la aplicación de principios SOLID, la
estrategia de testing y la integración CI/CD + calidad.

---

## 1. Patrón arquitectónico: Arquitectura Limpia (Hexagonal / Ports & Adapters)

El backend implementa **Arquitectura Limpia** con tres anillos concéntricos y la
**Regla de Dependencia**: las dependencias apuntan SIEMPRE hacia el centro. El
dominio no conoce Express, TypeORM ni jsonwebtoken.

```
        ┌──────────────────────────────────────────────────────┐
        │                 INFRASTRUCTURE                        │
        │  (Adaptadores: Express, TypeORM, JWT, bcrypt)         │
        │                                                       │
        │     ┌───────────────────────────────────────────┐    │
        │     │              APPLICATION                   │    │
        │     │      (Casos de uso / servicios)            │    │
        │     │                                            │    │
        │     │        ┌─────────────────────────┐         │    │
        │     │        │        DOMAIN           │         │    │
        │     │        │  Entidades · DTOs       │         │    │
        │     │        │  PUERTOS (interfaces)   │         │    │
        │     │        │  Errores                │         │    │
        │     │        └─────────────────────────┘         │    │
        │     │   depende de ▲ puertos del dominio          │    │
        │     └───────────────────────────────────────────┘    │
        │   implementa ▲ los puertos (adaptadores)              │
        └──────────────────────────────────────────────────────┘
                 La dependencia SIEMPRE apunta hacia adentro
```

| Anillo | Carpeta | Responsabilidad | Conoce a... |
|--------|---------|-----------------|-------------|
| **Domain** | `src/domain/` | Reglas y contratos puros: entidades, DTOs, **puertos** (interfaces) y errores. Sin frameworks. | Nada externo |
| **Application** | `src/application/` | Casos de uso (AuthService, HabitacionService, HealthService). Orquestan el dominio dependiendo SOLO de puertos. | Solo Domain |
| **Infrastructure** | `src/infrastructure/` | Adaptadores concretos: HTTP (Express), persistencia (TypeORM), seguridad (JWT/bcrypt), config. | Application + Domain |

**Puertos y Adaptadores (lo que evidencia el patrón):**

| Puerto (domain/ports) | Adaptador (infrastructure) |
|-----------------------|----------------------------|
| `IUserRepository` | `security/InMemoryUserRepository` |
| `IHabitacionRepository` | `persistence/TypeOrmHabitacionRepository` |
| `ITokenService` | `security/JwtTokenService` |
| `IRefreshTokenStore` | `security/InMemoryRefreshTokenStore` |

> El núcleo (dominio y casos de uso) no depende de Express ni TypeORM: solo
> depende de interfaces (puertos). Esto permite cambiar el repositorio in-memory
> por PostgreSQL, o jsonwebtoken por otra librería, modificando únicamente la
> capa de infraestructura y el contenedor de inyección de dependencias.

---

## 2. Principios SOLID aplicados (con evidencia en el código)

| Principio | Dónde se evidencia |
|-----------|--------------------|
| **SRP** | `JwtTokenService` solo firma/verifica JWT; `InMemoryRefreshTokenStore` solo gestiona rotación/revocación; `AuthService` solo orquesta el caso de uso. |
| **OCP** | Añadir un repositorio PostgreSQL o un store Redis no modifica los casos de uso (dependen de puertos). |
| **LSP** | `InMemoryUserRepository` es intercambiable por un `TypeOrmUserRepository`: ambos cumplen `IUserRepository`. |
| **ISP** | Puertos pequeños y específicos: `IUserRepository`, `IHabitacionRepository`, `ITokenService`, `IRefreshTokenStore`. |
| **DIP** | Los casos de uso reciben los puertos por **constructor**; el cableado vive solo en `infrastructure/config/container.ts` (Composition Root). |

> La **Regla de Dependencia** es justamente DIP a nivel de arquitectura: el código
> de alto nivel (dominio/casos de uso) no depende del de bajo nivel (frameworks),
> sino que ambos dependen de abstracciones (los puertos).

---

## 3. Seguridad: Autenticación JWT + Refresh Tokens

Esquema de **doble token** (industry standard):

- **Access Token** (15 min): lleva `sub`, `email`, `role`, `branch`. Se valida en
  cada request protegido vía `crearAuthMiddleware` (que depende del puerto `ITokenService`).
- **Refresh Token** (7 días): lleva un `jti` y se usa solo para renovar en `/api/auth/refresh`.

**Medidas implementadas:**

1. **bcrypt** para hashear contraseñas (nunca texto plano).
2. **Rotación de refresh tokens**: al renovar, el token usado se revoca y se emite
   uno nuevo → un refresh token robado deja de servir tras el primer uso legítimo.
3. **Revocación / logout** vía `IRefreshTokenStore`.
4. **Mitigación de timing attacks** en el login (compare contra hash dummy).
5. **Autorización por roles (RBAC)** con `autorizarRoles(...)`.
6. **Hardening HTTP**: `helmet` + CORS restringido a una lista blanca de orígenes.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Valida credenciales, emite access + refresh |
| POST | `/api/auth/refresh` | Renueva access token (con rotación) |
| POST | `/api/auth/logout` | Revoca el refresh token |

> **Justificación de la autenticación:** el sistema gestiona operaciones sensibles
> (folios, tarifas, check-in/out, datos de huéspedes) y separa portal público de
> panel administrativo. La autenticación **es necesaria**; JWT + refresh permite
> escalar sin estado de sesión en el servidor.

---

## 4. Estrategia de Testing

| Nivel | Qué prueba | Ejemplos |
|-------|------------|----------|
| **Unitario** | Casos de uso y adaptadores aislados (puertos mockeados) | `AuthService`, `JwtTokenService`, `HabitacionService` |
| **Integración** | Controlador + caso de uso | `HabitacionController.spec.ts` |
| **E2E API** | App Express real con `supertest` | `tests/e2e/api.e2e.ts` (login → refresh → rotación → RBAC) |

- **51 tests**, **cobertura ~98%** (umbral configurado en Jest: 70%).
- Reportes: `coverage/lcov.info` (Sonar) y `coverage/cobertura-coverage.xml`.
- Los tests NO requieren PostgreSQL: los puertos se sustituyen por dobles de prueba,
  garantizando un pipeline rápido y reproducible. Esto es **consecuencia directa**
  de la Arquitectura Limpia (depender de interfaces hace el negocio testeable).

---

## 5. CI/CD y Calidad

**Pipeline GitHub Actions** (`.github/workflows/ci.yml`): Lint → Format → Testing →
Build → SonarQube. Comandos centralizados en `Makefile` (`make ci`).

**SonarQube** (`sonar-project.properties`): consume el `lcov.info`, controla cobertura
(≥70%), bugs, code smells y vulnerabilidades. Issues resueltos: CORS restringido,
eliminación de credenciales hardcodeadas, uso de configuración centralizada.

---

## 6. Estructura de carpetas (backend)

```
src/
├── server.ts                         # Entry point (inicializa DataSource y escucha)
├── domain/                           # 🟢 NÚCLEO (sin frameworks)
│   ├── entities/Habitacion.entity.ts
│   ├── dtos/                         # Auth.dto, Habitacion.dto
│   ├── errors/AppError.ts
│   └── ports/                        # IUserRepository, IHabitacionRepository,
│                                     #   ITokenService, IRefreshTokenStore
├── application/                      # 🟡 CASOS DE USO (dependen de puertos)
│   ├── auth/AuthService.ts
│   ├── reservas/HabitacionService.ts
│   └── health/HealthService.ts
└── infrastructure/                   # 🔵 ADAPTADORES (frameworks)
    ├── config/                       # environment, database (TypeORM), container (DI)
    ├── persistence/                  # TypeOrmHabitacionRepository
    ├── security/                     # JwtTokenService, InMemoryUserRepository,
    │                                 #   InMemoryRefreshTokenStore
    └── http/                         # app.ts, controllers/, middleware/, routes/
```

> **Nota:** las tres carpetas `domain/`, `application/`, `infrastructure/`
> corresponden a los tres anillos. Los archivos de `domain/` no importan Express
> ni TypeORM: esa es la Regla de Dependencia reflejada en el código.

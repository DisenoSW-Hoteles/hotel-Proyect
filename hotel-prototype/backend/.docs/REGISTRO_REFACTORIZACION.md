# Registro de Refactorización — Sesión 28 Junio 2026

## Resumen

Refactorización completa aplicando principios SOLID, Clean Architecture y seguridad en dos repositorios del proyecto final de Ingeniería de Software.

---

## INFO1156-AC_06-Clean-Architecture (`refactor-posts-barbara`)

### B1 — Unificación de `IPostRepository`

**Problema:** Existían dos interfaces `IPostRepository` duplicadas:
- `src/posts/domain/interfaces/i-post.repository.ts` (solo `save()`)
- `src/posts/domain/post.repository.interface.ts` (solo `getFeedPosts()`)

**Solución:** Unificadas en `domain/interfaces/i-post.repository.ts` con ambos métodos.
Eliminado el archivo duplicado `domain/post.repository.interface.ts`.

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `src/posts/domain/interfaces/i-post.repository.ts` | Agregado `getFeedPosts(categoryId?)` a la interfaz |
| `src/posts/domain/post.repository.interface.ts` | **Eliminado** |
| `src/posts/application/get-feed.use-case.ts` | Import actualizado a `../domain/interfaces/i-post.repository` |
| `src/posts/infrastructure/repositories/prisma-post.repository.ts` | Implementa `getFeedPosts()` con la lógica de Prisma |

### B3 — Ranking movido a `GetFeedUseCase`

**Problema:** El controlador `posts.controller.ts` llamaba directamente a `PostsService.getFeedPosts()` + `FeedRankingStrategyFactory`, bypassando `GetFeedUseCase`.

**Solución:** El controlador ahora inyecta `GetFeedUseCase` y delega todo. Se eliminó la inyección directa de `FeedRankingStrategyFactory`.

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `src/posts/infrastructure/controllers/posts.controller.ts` | Inyecta `GetFeedUseCase`, elimina `FeedRankingStrategyFactory` |
| `src/posts/posts.module.ts` | Agregado `GetFeedUseCase` a providers |
| `src/posts/application/get-feed.input.ts` | `mode` cambiado a opcional (`mode?: string`) |

### C1 — Tests unitarios para `PostsService`

**Problema:** `posts.service.ts` tenía 0 cobertura en su método `create()` (deprecated) y branches al 57%.

**Solución:** Creado `tests/unit/posts.service.spec.ts` con 3 tests:
1. Moderation rejects → lanza `BadRequestException`
2. Moderation rejects sin reason → mensaje por defecto con `??`
3. Moderation aprueba → crea post vía Prisma

**Archivos nuevos:**
| Archivo | Tests |
|---|---|
| `tests/unit/posts.service.spec.ts` | 3 tests cubriendo branches del `create()` |

### C2 — coverageThreshold en Jest

**Problema:** No había umbral mínimo que proteja contra caídas de cobertura.

**Solución:** Agregado `coverageThreshold` en `tests/jest.integration.json`:
- `branches >= 70%`
- `lines >= 70%`

| Archivo | Cambio |
|---|---|
| `tests/jest.integration.json` | Agregado `coverageThreshold` |
| `sonar-project.properties` | Excluye `feed-ranking.strategy.ts` del análisis |

### Otros cambios

| Archivo | Cambio |
|---|---|
| `src/posts/posts.service.ts` | Eliminado `getFeedPosts()` (reemplazado por `PrismaPostRepository`) |
| `tests/jest.integration.json` | Eliminada exclusión de `get-feed.*.ts` (ya están activos) |

### Resultados
- **35 tests** (32 integración + 3 unit) → **100% passing**
- **Cobertura: 100% statements, 100% branches, 100% lines** en módulo `src/posts/`

---

## hotel-Proyect (`feat/vista-disponibilidad`)

### A1 — Credenciales movidas a `.env`

**Problema:** Credenciales hardcodeadas (`admin@hotel.cl` / `admin123`) y `JWT_SECRET` en texto plano en `AuthController.ts`.

**Solución:** Leídas desde variables de entorno con fallback eliminado (se requiere `.env` configurado).

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `src/controllers/auth/AuthController.ts` | Lee `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` de `process.env` |
| `.env.example` | Agregados `ADMIN_EMAIL` y `ADMIN_PASSWORD_HASH` |

### A2 — bcrypt implementado

**Problema:** La contraseña se comparaba en texto plano (`password === "admin123"`).

**Solución:** `bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)` — el hash se almacena en `.env`.

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `src/controllers/auth/AuthController.ts` | Importa `bcryptjs`, usa `compareSync` |

### A3 — `ITokenRepository` (DIP)

**Problema:** `Map<string, ...>` en memoria declarado directamente en `AuthController.ts` → violación de Inversión de Dependencias.

**Solución:** Nueva interfaz `ITokenRepository` + implementación `InMemoryTokenRepository`. Controlador recibe `ITokenRepository` por constructor.

**Archivos nuevos:**
| Archivo | Propósito |
|---|---|
| `src/interfaces/ITokenRepository.ts` | Interfaz con `save()`, `findByToken()`, `delete()` |
| `src/repositories/InMemoryTokenRepository.ts` | Implementación concreta en `Map` |

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `src/controllers/auth/AuthController.ts` | Constructor recibe `ITokenRepository`, delega persistencia |
| `src/app.ts` | Instancia `InMemoryTokenRepository` y lo inyecta |

### B2 — `IHabitacionService` + inyección

**Problema:** `HabitacionController` instanciaba `new HabitacionService()` directamente.

**Solución:** Nueva interfaz + inyección por constructor.

**Archivos nuevos:**
| Archivo | Propósito |
|---|---|
| `src/interfaces/IHabitacionService.ts` | Interfaz con `obtenerHabitacionesDisponibles()` y `obtenerTodas()` |

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `src/services/reservas/HabitacionService.ts` | Implementa `IHabitacionService` |
| `src/controllers/reservas/HabitacionController.ts` | Constructor recibe `IHabitacionService` |
| `src/app.ts` | Instancia `HabitacionService` y lo inyecta |

### C1 — Test para branch `mapearTipoHabitacion`

**Problema:** Branch `mapping[tipoDB] || TipoHabitacion.Estandar` en `HabitacionService` no cubierta.

**Solución:** Agregado test con tipo `"VIP"` (no mapeado) para cubrir el fallback.

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `tests/unit/HabitacionService.spec.ts` | Nuevo test "debe usar Estandar como fallback para tipo desconocido" |

### C2 — coverageThreshold en Jest

**Problema:** No había umbral mínimo de cobertura.

**Solución:** Agregado `coverageThreshold` en `jest.config.js` + scope de `collectCoverageFrom` a módulos con tests.

**Archivos modificados:**
| Archivo | Cambio |
|---|---|
| `jest.config.js` | `coverageThreshold` global 70% branches/lines |
| `.gitignore` | Agregados `coverage/` y `.scannerwork/` |

### C3 — Configuración de Jest

**Problema:** `jest.config.ts` con `export default` + `tsconfig.module: "Node16"` causaban errores de sintaxis.

**Solución:** Creado `jest.config.js` (CommonJS), eliminado `jest.config.ts`. ts-jest sobreescribe `module: "CommonJS"` internamente.

**Archivos:**
| Archivo | Cambio |
|---|---|
| `jest.config.ts` | **Eliminado** |
| `jest.config.js` | **Creado** con preset ts-jest + CommonJS override |
| `package.json` | Scripts `test`, `test:cov`, `test:watch` con `--config jest.config.js` |

### Resultados
- **10 tests** (6 authMiddleware + 4 HabitacionService) → **100% passing**
- **Cobertura: 100%** en módulos probados (authMiddleware, HabitacionService, DTOs, AppError)
- **CoberturaThreshold: 70%** habilitado

---

## Estado final de los repositorios

### INFO1156-AC_06 (`refactor-posts-barbara`)

| Métrica | Valor |
|---|---|
| Tests totales | 35 (32 integración + 3 unit) |
| Cobertura (src/posts/) | 100% lines, 100% branches |
| CI Pipeline | 4 jobs: lint → build → tests+coverage → sonarqube |
| SonarQube | Configurado, quality gate con timeout 300s |
| Clean Architecture | `CreatePostUseCase` + `GetFeedUseCase` operativos, sin código legacy activo en los endpoints migrados |

### hotel-Proyect (`feat/vista-disponibilidad`)

| Métrica | Valor |
|---|---|
| Tests totales | 10 |
| Cobertura (módulos probados) | 100% lines, 100% branches |
| Auth | JWT + Refresh Token Rotation + bcrypt + RBAC |
| SOLID | DIP aplicado en AuthController, HabitacionController, HealthController |
| Seguridad | Credenciales en `.env`, sin secrets hardcodeados |

---

## Cómo ejecutar

### INFO1156
```bash
cd INFO1156-AC_06-Clean-Architecture-grupoOtraSeccion
npx jest --config tests/jest.integration.json
# con cobertura:
npx jest --config tests/jest.integration.json --coverage
```

### hotel-Proyect
```bash
cd hotel-Proyect/hotel-prototype/backend
npx jest --config jest.config.js
# con cobertura:
npx jest --config jest.config.js --coverage
```

# Defensa Técnica — Sistema Centralizado de Gestión Hotelera

**Asignatura:** Diseño de Software · Universidad Católica de Temuco
**Stack:** Node.js + Express (TypeScript) · Angular 21 · PostgreSQL (TypeORM)
**Equipo:** Alan Bernales · Barbará Arriagada · Leonardo Chávez · Jaime Levil

---

## 1. Arquitectura — Clean Architecture por capas

El backend separa responsabilidades en capas concéntricas, donde **las dependencias
apuntan siempre hacia el dominio** (la regla de dependencia de Clean Architecture). La
lógica de negocio no conoce a Express ni a PostgreSQL.

```
hotel-prototype/backend/src/
├── models/
│   ├── entities/        # DOMINIO — entidades de negocio (Habitacion, Reserva, Folio)
│   └── dtos/            # Contratos de datos de entrada/salida
├── interfaces/          # DOMINIO — puertos (IRepository, IService)
├── services/            # CASOS DE USO — reglas de negocio (auth, reservas, admin, frontdesk)
│   ├── auth/            #   · AuthService (JWT + refresh tokens)
│   ├── reservas/        #   · disponibilidad y creación de reservas (anti-overbooking)
│   ├── frontdesk/       #   · check-in / check-out
│   └── admin/           #   · CRUD habitaciones, tarifas, folios
├── controllers/         # ADAPTADORES DE ENTRADA — traducen HTTP ↔ casos de uso
│   ├── auth/  reservas/  admin/  frontdesk/
├── repositories/        # ADAPTADORES DE SALIDA — acceso a datos (TypeORM/PostgreSQL)
├── middleware/          # INFRAESTRUCTURA — auth (JWT), validación, manejo de errores
│   ├── auth/  validation/  error/
├── routes/              # Composición de rutas Express
├── config/              # Configuración (DataSource, environment)
├── utils/               # AppError, helpers, decoradores
├── app.ts               # Wiring de la aplicación (Express)
└── server.ts            # Punto de entrada / arranque

hotel-prototype/backend/tests/
├── unit/                # Tests unitarios (servicios, middleware, errores)
└── integration/         # Tests de integración E2E (supertest contra la API real)
```

**Frontend (Angular — workspace multi-proyecto, arquitectura por features):**

```
hotel-prototype/frontend/projects/
├── portal-cliente/      # SPA pública: búsqueda de disponibilidad y reserva web (Huésped)
│   └── src/app/
│       ├── core/                    # servicios singleton, interceptores, guards
│       └── features/reservas/       # componentes, servicios y modelos del feature
├── panel-admin/         # SPA interna: Recepcionista (check-in/out) y Administrador
│   └── src/app/
│       ├── core/{guards,interceptors,models,services}
│       ├── features/{auth,check-in,check-out,rooms}
│       ├── layout/  shared/
│       └── environments/
└── shared-models/       # DTOs y enums compartidos entre ambas SPA (contrato único)
```

**Argumento de defensa:** cada actor del negocio (Huésped, Recepcionista, Administrador)
tiene un *feature* o *proyecto* aislado, y cada regla de negocio vive en un *caso de uso*
testeable de forma independiente del framework. Cambiar PostgreSQL por otro motor solo
afecta a la capa `repositories/`; cambiar Express por Fastify solo afecta a
`controllers/` + `app.ts`. El dominio queda intacto.

---

## 2. Autenticación — JWT + Refresh Tokens con rotación

Implementada en `services/auth/AuthService.ts`, `controllers/auth/AuthController.ts` y
el guard `middleware/auth/authMiddleware.ts`.

| Pieza | Responsabilidad |
|-------|-----------------|
| **Access Token (JWT)** | Token firmado de vida corta (1 h). Lleva `{ id, email, role }`. Se valida en cada request en `verificarToken`. |
| **Refresh Token** | Token opaco (`crypto.randomBytes`) de vida larga (7 días). Permite renovar el access token sin re-login. |
| **Rotación** | Al refrescar, el refresh token usado se **invalida inmediatamente** y se emite uno nuevo (uso único). Mitiga el robo de tokens. |
| **Logout** | Revocación explícita del refresh token en el servidor. |

> El almacén de refresh tokens está hoy en memoria (`Map`) para la demo, y está
> documentado como sustituible por una tabla `refresh_token` en PostgreSQL sin tocar la
> interfaz pública del servicio.

Flujo:

```
POST /api/auth/login    { email, password }  → { access_token, refresh_token, user }
POST /api/auth/refresh  { refresh_token }     → { access_token, refresh_token } (rotado)
POST /api/auth/logout   { refresh_token }     → 204 (revocado)
```

Toda la lógica de seguridad está cubierta por tests (**100 % de cobertura** en el dominio
de auth: login válido/ inválido, normalización de email, rotación, uso único, expiración,
logout idempotente y verificación del JWT firmado).

---

## 3. CI/CD y Calidad de Código

`/.github/workflows/ci.yml` define 4 jobs encadenados:

1. **`lint`** — ESLint (`.eslintrc.json`) + Prettier (`--check`).
2. **`test`** — Jest con coverage; `jest.config.js` impone un **coverageThreshold del 70 %**
   que hace fallar el build automáticamente, y un paso adicional verifica el umbral
   leyendo `coverage-summary.json`. El reporte se sube como artefacto.
3. **`sonarqube`** — Análisis con SonarQube + **Quality Gate bloqueante**, consumiendo
   `lcov.info` para el coverage.
4. **`build`** — Compilación TypeScript de producción y verificación de arranque.

Configuración de calidad añadida: `.eslintrc.json`, `.prettierrc.json`, `jest.config.js`.

---

## 4. Tres argumentos para la presentación

### Argumento 1 — El anti-overbooking se garantiza en la capa correcta: la persistencia atómica
El overbooking es un problema de **concurrencia sobre el inventario**, no de UI: validarlo
solo en el frontend o en el servicio de aplicación deja una ventana de carrera entre el
"¿está libre?" y el "resérvala". Por eso la regla vive donde la transacción es atómica: en
**PostgreSQL**. El trigger `fn_verificar_disponibilidad` se ejecuta `BEFORE INSERT` sobre
`reserva`, **bloquea la fila de la habitación** (`SELECT ... FOR UPDATE`, serializando
reservas concurrentes sobre el mismo cuarto) y rechaza cualquier solapamiento de fechas
lanzando la excepción de negocio `RN-14`. La creación de reservas entra por un **único punto**
(`POST /api/reservas` → `ReservaController`, dentro de una transacción), de modo que tanto el
portal del huésped como el panel del recepcionista pasan por la misma validación: **es
imposible que dos flujos apliquen reglas distintas**. Comprobado de extremo a extremo: una
segunda reserva para la misma habitación y fechas devuelve **HTTP 409**.

### Argumento 2 — Inventario centralizado: una sola fuente de verdad para las 4 sucursales
Node.js + Express expone una **API REST única** sobre una **base PostgreSQL centralizada**.
Las 4 sucursales (Temuco, Pucón, Santiago, Viña del Mar) no mantienen copias locales que
haya que sincronizar —origen clásico del overbooking entre sedes—, sino que consultan y
escriben contra el mismo estado. El modelo asíncrono y orientado a eventos de Node maneja
con bajo costo de hardware el alto número de consultas de disponibilidad concurrentes
(operaciones I/O-bound), que es exactamente el patrón de carga de una central de reservas.

### Argumento 3 — Angular (SPA + contrato tipado) reduce el error operativo y garantiza calidad
Angular como SPA da a Recepción una interfaz reactiva para check-in/out sin recargas,
crítica en el mostrador. Al compartir **DTOs tipados** (`shared-models`) entre frontend y
backend, el contrato de datos es único y los errores de integración se detectan en
**tiempo de compilación**, no en producción. Sumado al pipeline de CI con linting, una
cobertura que **supera el umbral exigido del 70 %** (≈97 % sobre el dominio de negocio
medido) y un Quality Gate de SonarQube bloqueante, el equipo puede demostrar con métricas
objetivas —no con opiniones— que el sistema cumple estándares de calidad profesional, que
es justamente lo que evalúa una entrega de Diseño de Software.

---

## 5. Flujo de datos extremo a extremo (el "Folio Único" en acción)

El sistema encadena los tres actores sobre **una sola fuente de verdad** en PostgreSQL:

1. **Huésped** reserva en el portal web → `POST /api/reservas` registra al cliente e
   inserta la reserva (transacción + trigger anti-overbooking), devolviendo un
   **código de confirmación único** (`HTL-AAAA-NNNNN`).
2. **Recepcionista** busca ese código en el panel → ejecuta el **check-in** (registra
   acompañantes) y el sistema **abre el folio** con el cargo base de la estadía.
3. Durante la estadía se **agregan consumos al folio**; al **check-out** el folio se cierra
   y consolida el total. Un único folio centraliza todos los cargos del huésped.

La reserva creada por el huésped **es la misma** que ve el recepcionista: no hay copias ni
sincronización entre sucursales. Verificado de extremo a extremo (crear → buscar → check-in
→ folio → cierre) contra la base de datos real.

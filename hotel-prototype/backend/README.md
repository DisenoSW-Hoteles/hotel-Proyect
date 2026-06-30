# 🛎️ Backend — Hotel Management System

API REST (Node.js + Express + TypeScript) con **arquitectura por capas**,
**autenticación JWT + Refresh Tokens** y **PostgreSQL** vía TypeORM.

> Arquitectura detallada y decisiones de diseño: ver [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md).

---

## ✅ Requisitos

- Node.js ≥ 20
- npm ≥ 9
- PostgreSQL ≥ 13 (para la demo funcional completa)

---

## 🚀 Puesta en marcha

```bash
cd hotel-prototype/backend

# 1) Instalar dependencias
npm install

# 2) Configurar variables de entorno
cp .env.example .env     # edita credenciales de BD y secretos JWT

# 3) Levantar en desarrollo (hot reload)
npm run dev              # http://localhost:4000
```

Documentación interactiva (Swagger): **http://localhost:4000/api-docs**

---

## 🗄️ Base de datos (demo funcional)

Con PostgreSQL instalado, crea la base y carga esquema + datos:

```bash
# Crear la base
createdb hotel_mvp

# Cargar esquema, vistas y seeds (rutas desde la raíz del repo)
psql -d hotel_mvp -f database/01_schema/init.sql
psql -d hotel_mvp -f database/01_schema/views.sql
psql -d hotel_mvp -f database/03_seed/seeds.sql
```

> El **login NO requiere base de datos** (usuarios in-memory con hash bcrypt), por
> lo que la autenticación funciona aunque PostgreSQL no esté levantado. La BD se
> usa para la búsqueda de disponibilidad y el catálogo de habitaciones.

### 👤 Credenciales de demostración

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@hotel.cl` | `Admin123!` | `SUPER_ADMIN` |
| `recepcion@hotel.cl` | `Recepcion123!` | `RECEPCIONISTA` |

---

## 🧪 Calidad y pruebas

```bash
npm run lint         # ESLint
npm run format       # Prettier (verificación)
npm run format:fix   # Prettier (autocorrección)
npm test             # Tests (unit + integración + E2E)
npm run test:cov     # Tests + cobertura (genera coverage/)
npm run build        # Compilación TypeScript
```

- **51 tests** · **cobertura ~98%** (umbral configurado en Jest: 70%).
- Reportes en `coverage/`: `lcov.info` (Sonar) y `cobertura-coverage.xml`.

Desde la raíz del repo puedes usar el Makefile: `make ci`.

---

## 🔌 Endpoints principales

| Método | Ruta | Protegido | Descripción |
|--------|------|-----------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Login (access + refresh token) |
| POST | `/api/auth/refresh` | No | Renueva access token (con rotación) |
| POST | `/api/auth/logout` | No | Revoca el refresh token |
| POST | `/api/habitaciones/disponibilidad` | No | Busca habitaciones disponibles |
| GET | `/api/admin/rooms` | JWT + rol ADMIN | Catálogo de habitaciones |

### Ejemplo de flujo con `curl`

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotel.cl","password":"Admin123!"}'

# Acceder a ruta protegida (reemplaza <ACCESS_TOKEN>)
curl http://localhost:4000/api/admin/rooms \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

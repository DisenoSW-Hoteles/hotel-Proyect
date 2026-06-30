# ▶️ Cómo ejecutar el proyecto (demo local)

Stack: PostgreSQL + Express/Node (TypeScript) + Angular (monorepo). Necesitas
**3 terminales**: base de datos (una vez), backend y frontend.

---

## 1. Base de datos (solo la primera vez)

PostgreSQL debe estar instalado y corriendo en el puerto **5432**.

```powershell
# Crear la base y cargar esquema + datos (ajusta la ruta de psql a tu versión)
$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$env:PGPASSWORD = "postgres"
& $psql -h localhost -U postgres -c "CREATE DATABASE hotel_mvp;"
& $psql -h localhost -U postgres -d hotel_mvp -f hotel-prototype\database\01_schema\init.sql
& $psql -h localhost -U postgres -d hotel_mvp -f hotel-prototype\database\01_schema\views.sql
& $psql -h localhost -U postgres -d hotel_mvp -f hotel-prototype\database\03_seed\seeds.sql
```

Datos cargados: 4 sucursales (TEMUCO, PUCON, SANTIAGO, VINA_DEL_MAR), 14 habitaciones, tarifas.

> El archivo `hotel-prototype/backend/.env` ya está configurado para conectarse
> (host localhost, puerto 5432, usuario postgres, base hotel_mvp). Si tu contraseña
> de Postgres no es `postgres`, edítala en `DB_PASS`.

---

## 2. Backend (Terminal 1)

```powershell
cd hotel-prototype\backend
npm install        # solo la primera vez
npm run dev        # arranca en http://localhost:4000
```

- API: http://localhost:4000
- Swagger: http://localhost:4000/api-docs
- Credenciales: `admin@hotel.cl / Admin123!` · `recepcion@hotel.cl / Recepcion123!`

Prueba rápida (otra terminal):
```powershell
curl http://localhost:4000/api/health
```

---

## 3. Frontend (Terminal 2 y, si quieres, Terminal 3)

```powershell
cd hotel-prototype\frontend
npm install                       # solo la primera vez
npx ng build shared-models        # compila la librería compartida (primera vez)

# Portal público (clientes / reservas)
npx ng serve portal-cliente       # http://localhost:4200

# Panel administrativo (en otra terminal)
npx ng serve panel-admin --port 4201 --proxy-config proxy.conf.json
```

- `portal-cliente` llama al backend en `http://localhost:4000/api`.
- `panel-admin` usa el proxy (`/api` → `http://localhost:4000`).
- `panel-admin` ya está con `mockAuth: false` (login real contra el backend). Para
  usar la UI sin backend, ponlo en `true` en
  `projects/panel-admin/src/environments/environment.ts`.

### Datos de demo para check-in / check-out

| Código reserva | Huésped | Documento | Sucursal |
|---|---|---|---|
| `ABC123` | Juan Pérez | 12.345.678-9 | TEMUCO |
| `XYZ789` | María González | 9.876.543-2 | PUCON |

> El backend usa datos **en memoria**: al reiniciar `npm run dev` se restablecen
> (las reservas vuelven a estado CONFIRMED y los folios a OPEN).

---

## Estado de integración (qué está cableado al backend real)

| Funcionalidad | Frontend | Endpoint backend | Estado |
|---|---|---|---|
| Login / sesión | panel-admin | `POST /api/auth/login`, `/refresh`, `/logout` | ✅ Real |
| Catálogo de habitaciones | panel-admin (rooms) | `GET /api/admin/rooms` (JWT+rol) | ✅ Real |
| Búsqueda de disponibilidad | portal-cliente | `POST /api/habitaciones/disponibilidad` | ✅ Real (PostgreSQL) |
| Check-in | panel-admin | `GET/POST /api/admin/reservations/...` | ✅ Real (datos en memoria) |
| Check-out / Folios | panel-admin | `GET/POST/PATCH /api/admin/folios/...` | ✅ Real (datos en memoria) |

---

## Notas

- **`ng serve` (modo demo) no requiere internet.** El `ng build` de *producción*
  intenta descargar la fuente Material Icons; si la red falla, usa
  `ng build <app> --configuration development` o `ng serve`.
- Detener un servidor: `Ctrl + C` en su terminal.

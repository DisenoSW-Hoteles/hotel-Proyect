# Hotel Prototype

## Credenciales de Acceso

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@hotel.cl` | `admin123` | `SUPER_ADMIN` |

## Problemas Corregidos

### 1. Bucle de redirección al cargar la app
- **Causa:** La ruta por defecto (`path: ''`) en `app.routes.ts` redirigía a `/admin/front-desk/check-in`, una ruta protegida que el `authGuard` bloqueaba redirigiendo al login, causando un bucle visual.
- **Solución:** Cambio de `redirectTo` a `/auth/login`.

### 2. Login hardcodeado (solo aceptaba `admin@hotel.cl`)
- **Causa:** `AuthController.ts` comparaba el email contra la constante `ADMIN_EMAIL` del `.env`, rechazando cualquier otro email.
- **Solución:** Se creó un `InMemoryUserRepository` con múltiples usuarios y se movió la lógica de autenticación a `AuthService`.

### 3. Validación de contraseña desactivada
- **Causa:** `const passwordValid = true` — bcrypt estaba bypassado.
- **Solución:** `AuthService.login()` usa `bcrypt.compareSync(password, user.passwordHash)`.

## Arquitectura Aplicada

```
AuthController  →  IAuthService / AuthService  →  IUserRepository / InMemoryUserRepository
                                               →  ITokenRepository / InMemoryTokenRepository
```

- **SRP:** `AuthController` solo maneja HTTP; `AuthService` contiene la lógica de negocio.
- **DIP:** `AuthController` depende de las interfaces `IAuthService` y `ITokenRepository`, no de implementaciones concretas.
- **OCP:** Nuevos repositorios de usuarios (BD, API externa) pueden implementar `IUserRepository` sin modificar `AuthService`.

## Comandos

```bash
# Backend
cd backend
pnpm run dev       # Inicia servidor en http://localhost:4000

# Frontend
cd frontend
pnpm run dev       # Inicia Angular en http://localhost:4200

# Tests
cd backend
pnpm test          # 26 tests unitarios
```

## Tests

Suite de 26 tests unitarios (Jest) en `backend/tests/`:
- `authMiddleware.spec.ts` — 6 tests
- `HabitacionService.spec.ts` — 4 tests
- `ReservaService.spec.ts` — 4 tests
- `ReservaValidation.spec.ts` — 12 tests

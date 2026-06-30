# 🔍 Integración con SonarQube (servidor UCT)

Servidor: **https://sonarqube.inf.uct.cl** · Versión 26.x · Login con usuario/contraseña.

> Tu proyecto NO usa SonarCloud, sino el **SonarQube self-hosted de la universidad**.
> Por eso NO se configura `organization` y el token se genera dentro de ese servidor.

---

## Paso 1 — Generar un token (NO uses tu contraseña)

1. Entra a https://sonarqube.inf.uct.cl con tu usuario.
2. Arriba a la derecha: tu **avatar → My Account → Security**.
3. En **Generate Tokens**: escribe un nombre (ej. `hotel-token`), tipo
   **"Global Analysis Token"** (o "User Token"), y pulsa **Generate**.
4. **Copia el token** (solo se muestra una vez). Lo usarás como `SONAR_TOKEN`.

---

## Paso 2 — Crear el proyecto en SonarQube

1. Menú **Projects → Create Project → Manually** (o "Local project").
2. **Project key** y **Display name**: por ejemplo `hotel-management-backend`.
   (El *key* debe ser único en el servidor; si está tomado, agrega tus iniciales).
3. En "How do you want to analyze": elige **Locally** / **Other (manual)**.
4. Si te ofrece elegir definición de *New Code*: deja **"Previous version"**.

> Si no tienes permiso para crear proyectos, pídeselo a tu docente o usa un *key*
> que el servidor permita auto-provisionar en el primer análisis.

## Paso 3 — Poner tu project key en la configuración

Edita `sonar-project.properties` (raíz del repo) y reemplaza:

```properties
sonar.projectKey=REEMPLAZAR_TU_PROJECT_KEY
```

por el key real, p. ej.:

```properties
sonar.projectKey=hotel-management-backend
```

---

## Paso 4 — Ejecutar el análisis

Tienes dos caminos. Para la **demo y evidencia inmediata**, usa el **local (A)**.

### Opción A — Análisis local (recomendado para la demo)

Desde la **raíz del repositorio**, en PowerShell:

```powershell
# 1) Generar la cobertura (crea coverage/lcov.info)
cd hotel-prototype\backend
npm run test:cov
cd ..\..

# 2) El token y la URL van como VARIABLES DE ENTORNO (el scanner v4 NO usa -D)
$env:SONAR_TOKEN="PEGA_AQUI_TU_TOKEN"
$env:SONAR_HOST_URL="https://sonarqube.inf.uct.cl"

# 3) Lanzar el scanner (lee sonar-project.properties solo)
npx sonarqube-scanner
```

El scanner lee `sonar-project.properties` (host, projectKey, sources y la ruta del
`lcov.info`) y toma el token/URL de las variables de entorno. Al terminar verás la
URL del análisis; ábrela para ver cobertura, bugs, code smells y vulnerabilidades.

> Atajo: `make sonar` (define antes `SONAR_TOKEN` en tu entorno).
>
> ⚠️ El scanner v4 NO acepta `-Dsonar.token=...` como argumento (da el error
> "too many arguments"). Usa siempre la variable de entorno `SONAR_TOKEN`.

### Opción B — Análisis automático en GitHub Actions (CI)

El pipeline ya tiene el paso de SonarQube (`.github/workflows/ci.yml`). Solo falta
el token:

1. GitHub → tu repo → **Settings → Secrets and variables → Actions**.
2. **New repository secret** → Nombre: `SONAR_TOKEN` → Valor: el token del Paso 1.
3. En el próximo push, el job correrá el análisis contra el servidor UCT
   (la URL ya está fijada en el workflow: `SONAR_HOST_URL=https://sonarqube.inf.uct.cl`).

---

## Paso 5 — Cumplir el mínimo de cobertura (70%)

Tu cobertura local es **~98%** y se sube vía `lcov.info`, así que el Quality Gate de
cobertura se cumple con holgura. Si el servidor marca un *bug* o *vulnerability*
crítico, el flujo es: revisar el issue en el dashboard → corregir en el código →
volver a analizar.

---

## ✅ Checklist SonarQube

- [ ] Token generado en SonarQube (NO la contraseña).
- [ ] Proyecto creado y `sonar.projectKey` actualizado en `sonar-project.properties`.
- [ ] `npm run test:cov` ejecutado (existe `coverage/lcov.info`).
- [ ] Análisis local OK (Opción A) **o** secreto `SONAR_TOKEN` en GitHub (Opción B).
- [ ] Dashboard muestra cobertura ≥ 70% y Quality Gate "Passed".

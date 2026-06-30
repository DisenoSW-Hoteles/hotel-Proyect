# 🏨 Sistema de Gestión Hotelera Centralizado (MVP)

Este repositorio contiene el desarrollo de un Sistema de Gestión Hotelera Centralizado. El objetivo de este proyecto es abarcar el ciclo completo de desarrollo de software: desde el levantamiento de requerimientos y diseño arquitectónico, hasta el despliegue y mantenimiento, aplicando estándares de la industria y buenas prácticas de ingeniería.

## 💻 Stack Tecnológico (PEAN)

El proyecto está construido bajo una arquitectura de software limpia utilizando las siguientes tecnologías:

- **Frontend:** Angular (Monorepo Workspace)
- **Backend:** Node.js con Express
- **Base de Datos:** PostgreSQL
- **Lenguaje Transversal:** TypeScript (Tipado estricto en todo el stack)

## 🏗️ Arquitectura del Sistema

El proyecto se divide estructuralmente para garantizar el Principio de Responsabilidad Única (SRP) y la Inversión de Dependencias (DIP):

- **Backend (`/backend`):** API RESTful estructurada en un patrón de capas estricto (Rutas → Controladores → Servicios → Repositorios).
- **Frontend (`/frontend`):** Monorepo de Angular que separa los dominios de seguridad:
  - `portal-cliente`: Aplicación pública para huéspedes.
  - `panel-admin`: Aplicación privada para la administración operativa.
  - `shared-models`: Librería compartida para centralizar los contratos DTOs e interfaces.
- **Database (`/database`):** Control de versiones para scripts DDL y migraciones SQL.

---

## 1. Contexto y Problemática

### 1.1. Necesidad del Sistema

Esta propuesta arquitectónica se desarrolla para una cadena hotelera en fase de expansión, con presencia estratégica en Temuco, Pucón, Santiago y Viña del Mar. Actualmente, operar con sistemas aislados por sucursal genera vulnerabilidades críticas:

- Riesgo de sobreventa de habitaciones (overbooking).
- Tiempos de espera prolongados en check-in/check-out.
- Pérdida de trazabilidad en facturación de servicios adicionales (cafetería, eventos, daños).

La gestión manual de reglas de negocio expone a la empresa a errores y multas legales. Por consiguiente, es imperativa la construcción de un sistema centralizado, escalable y de alta disponibilidad que unifique la operación, automatice el flujo de caja y eleve la experiencia del huésped.

### 1.2. Alcance del Proyecto

- **Gestión de Reservas y Habitaciones:** Control de inventario en tiempo real para categorías Estándar, Plus y Suite Ejecutiva, previniendo conflictos de concurrencia.
- **Servicios Adicionales:** Administración de desayuno y orquestación de eventos privados (límite de 25 asistentes y validación legal de alcohol).
- **Facturación Consolidada:** Generación de un folio único por huésped centralizando costos y penalizaciones.
- **Control de Accesos:** Autenticación y autorización basada en roles (RBAC).

### 1.3. Limitaciones (Fuera de Alcance)

Para mantener la alta cohesión del sistema, se delegan las siguientes responsabilidades:

- **Procesamiento de Pagos:** Integración con Pasarela externa (cumplimiento PCI-DSS).
- **Emisión Tributaria:** Integración directa con los servicios del SII para DTE.
- **Recursos Humanos e Inventario:** Control de turnos y stock físico quedan excluidos.

### 1.4. Oportunidades Futuras

- **Escalabilidad Geográfica:** Incorporación de nuevas sucursales sin reescribir código (Principio Open/Closed).
- **Minería de Datos:** Análisis (BI) para predecir temporadas, optimizar precios y personalizar ofertas.

---

## 🛠️ Flujo de Trabajo Git (Git Flow) del Equipo

Para garantizar la integridad de la arquitectura y evitar conflictos, la rama `main` está **protegida**. Todo desarrollo debe seguir estrictamente este ciclo:

### 1. Sincronizar el entorno local

Antes de programar, descarga la versión más reciente:

```bash
git checkout main
git pull origin main
2. Crear una rama de trabajo aislada
Crea una rama a partir de main. Convenciones de nombres:

feat/nombre-tarea (Nuevas funcionalidades)

fix/nombre-error (Corrección de bugs)

refactor/nombre-componente (Mejoras de código)

Bash
git checkout -b feat/crear-endpoint-checkin
3. Desarrollo y Commits
Aplica principios SOLID y realiza commits atómicos:

Bash
git add .
git commit -m "feat: agrega controlador para el check-in de huéspedes"
4. Subir la rama al servidor remoto (Push)
Publica tu rama local en GitHub:

Bash
git push -u origin feat/crear-endpoint-checkin
5. Crear el Pull Request (PR)
Ve al repositorio en GitHub.

Haz clic en "Compare & pull request".

Explica tu código y asigna al menos a un revisor del equipo.

Haz clic en "Create pull request".

6. Revisión de Código y Fusión
El revisor asignado auditará el código:

Si hay errores: Solicita cambios ("Request Changes"). El autor debe corregir, hacer commit y un nuevo push.

Si es aprobado: El revisor fusiona presionando "Merge pull request".

7. Limpieza local
Una vez fusionado el PR, actualiza tu equipo y borra la rama usada:

Bash
git checkout main
git pull origin main
git branch -d feat/crear-endpoint-checkin

***

Para dejar este repositorio listo para que tus compañeros clonen y comiencen a trabajar, ¿te gustaría que agreguemos una sección final con los comandos exactos de instalación local (`npm install`, configuración del `.env` y ejecución de servidores)?
```

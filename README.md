# hotel-Proyect

Este repositorio es para llevar el control de versiones de un trabajo de desarrollo de un programa.
El objetivo es declarar una hipotetica problematica y una solucion para desarrollar, practicar todas las estapas de desarrollo desde la documentacion hasta el despliegue y mantenimiento.

1.Contexto y Problemática

1.1.Descripción del Problema y Necesidad del Sistema:

La presente propuesta arquitectónica se desarrolla para una cadena hotelera en fase de expan-
sión, con presencia estratégica en las ciudades de Temuco, Pucón, Santiago y Viña del Mar. Ac-
tualmente, el crecimiento de la cadena ha evidenciado las limitaciones de operar con sistemas de
gestión aislados por sucursal. Esta descentralización operativa genera vulnerabilidades críticas para
el negocio: riesgo de sobreventa de habitaciones (overbooking), tiempos de espera prolongados en
los procesos de check-in/check-out, y pérdida de trazabilidad en la facturación de servicios adicio-
nales (como cafetería, eventos privados y cobros por daños).

Adicionalmente, la gestión manual de reglas de negocio complejas —como la restricción de
venta de alcohol a menores en eventos privados o el cálculo de recargos dinámicos— es propensa a
errores humanos, exponiendo a la empresa a multas legales y pérdidas financieras. Por consiguiente,
es imperativa la construcción de un sistema centralizado, escalable y de alta disponibilidad que
unifique la operación de todas las sucursales, automatice el flujo de caja, garantice el cumplimiento
normativo y eleve la experiencia del huésped.

1.2.
Alcance del Proyecto

El sistema propuesto abarcará la gestión integral del ciclo de vida del huésped y la administra-
ción de los recursos hoteleros. Sus fronteras operativas incluyen:

- Gestión de Reservas y Habitaciones: Control de inventario en tiempo real para tres catego-
  rías de habitaciones (Estándar, Plus, Suite Ejecutiva), previniendo conflictos de concurrencia.

- Gestión de Servicios Adicionales: Administración de modalidades de desayuno (en habita-
  ción o cafetería) y orquestación de eventos privados en Suites Ejecutivas (con límite de 25
  asistentes y validación legal de consumo de alcohol).

- Motor de Facturación Consolidada: Generación de un folio único por huésped que centra-
  lice el costo de la habitación, consumos extra y posibles penalizaciones (daños).

- Control de Accesos: Autenticación y autorización basada en roles (RBAC) para huéspedes,
  recepcionistas y administradores.

  1.3.
  Limitaciones y Exclusiones (Fuera de Alcance)

Para mantener la alta cohesión del sistema y respetar el Principio de Responsabilidad Única
(SRP) a nivel de arquitectura, se establecen las siguientes limitaciones:

- Procesamiento de Pagos: El sistema no almacenará ni procesará directamente información
  de tarjetas de crédito. Se integrará con una Pasarela de Pagos externa, delegando el cumpli-
  miento estricto de la normativa PCI-DSS.
- Emisión Tributaria: La generación legal de boletas y facturas electrónicas (DTE) será dele-
  gada mediante integración directa a los servicios del Servicio de Impuestos Internos (SII).
- Gestión de Recursos Humanos e Inventario Físico: El control de turnos del personal, liqui-
  daciones de sueldo y el control de stock de insumos físicos (bodega de alimentos o limpieza)
  quedan excluidos de esta plataforma.

  1.4.
  Oportunidades del Proyecto
  La adopción de esta plataforma centralizada, construida bajo principios de Clean Architecture
  y patrones de diseño estructurados, abre oportunidades estratégicas a mediano plazo:

- Escalabilidad Geográfica: La arquitectura permitirá incorporar nuevas sucursales al sistema
  de manera transparente, sin requerir reescritura de código (cumpliendo el principio Open/-
  Closed).
- Minería de Datos: La centralización de la información habilitará futuros análisis de inteli-
  gencia de negocios (BI) para predecir temporadas altas, optimizar precios (precios dinámi-
  cos) y personalizar ofertas basadas en el historial del huésped.

Universidad Católica de Temuco
Facultad de Ingeniería
Ingeniería civil en Informática




                                  HOTELES




                                       Nombre:                   Barbara Arriagada.
                                                                 Alan Bernales.
                                                                 Leonardo chavez.
                                                                 Jaime Levil.
                                       Docente: Guido Mellado .
                                       Fecha de entrega: 24 de marzo 2026
Índice de Contenidos                                                                              I



Índice de Contenidos
1. Contexto y Problemática                                                                       1
   1.1. Descripción del Problema y Necesidad del Sistema . . . . . . . . . . . . . . . . .       1
   1.2. Alcance del Proyecto . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   1
   1.3. Limitaciones y Exclusiones (Fuera de Alcance) . . . . . . . . . . . . . . . . . . .      1
   1.4. Oportunidades del Proyecto . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   2

2. Requisitos funcionales                                                                        3
   2.1. Búsqueda y gestión de reservas . . . . . . . . . . . . . . . . . . . . . . . . . . . .   3
   2.2. Gestión de Desayunos y Cafetería . . . . . . . . . . . . . . . . . . . . . . . . . .     4
   2.3. Gestión de Eventos Privados (Exclusivo Suite Ejecutiva) . . . . . . . . . . . . . .      4
   2.4. Operación del Hotel (Folio, Daños y Check-out) . . . . . . . . . . . . . . . . . . .     5
   2.5. Administración del Sistema . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   5

3. Requisitos No Funcionales                                                                     6
   3.1. Rendimiento y Eficiencia . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   6
   3.2. Seguridad y Privacidad . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   6
   3.3. Usabilidad y Experiencia de Usuario . . . . . . . . . . . . . . . . . . . . . . . . .    6
   3.4. Mantenibilidad y Soportabilidad . . . . . . . . . . . . . . . . . . . . . . . . . . .    7
   3.5. Disponibilidad y Confiabilidad . . . . . . . . . . . . . . . . . . . . . . . . . . . .   7
   3.6. Portabilidad y Compatibilidad . . . . . . . . . . . . . . . . . . . . . . . . . . . .    8

4. Reglas de Negocio                                                                             9

5. Identificación de Stakeholders y Actores                                                      14
   5.1. Actores Primarios (Usuarios Directos) . . . . . . . . . . . . . . . . . . . . . . . .    14
   5.2. Actores Secundarios e Interesados (Sistemas y Gestión) . . . . . . . . . . . . . . .     15
   5.3. Matriz de Relaciones y Nivel de Implicación . . . . . . . . . . . . . . . . . . . . .    15

6. Diagrama de Contexto (Nivel 0)                                                                16
   6.1. Definición de Fronteras y Delegación de Responsabilidades . . . . . . . . . . . . .      16
   6.2. Representación del Diagrama de Contexto . . . . . . . . . . . . . . . . . . . . . .      16
   6.3. Descripción de Flujos de Datos Críticos . . . . . . . . . . . . . . . . . . . . . . .    17

7. Modelo de Casos de Uso del Sistema                                                            18
   7.1. Diagrama General de Casos de Uso (UML) . . . . . . . . . . . . . . . . . . . . .         18
   7.2. Análisis de Exhaustividad y Validación de Requerimientos . . . . . . . . . . . . .       20
   7.3. Especificación de Casos de Uso (Módulo de Reservas) . . . . . . . . . . . . . . .        21
        7.3.1. CU-01: Realizar Reserva . . . . . . . . . . . . . . . . . . . . . . . . . . .     21
        7.3.2. CU-02: Cancelar Reserva . . . . . . . . . . . . . . . . . . . . . . . . . .       21
        7.3.3. CU-13: Buscar Disponibilidad . . . . . . . . . . . . . . . . . . . . . . . .      21
   7.4. Especificación de Casos de Uso (Módulo Front-Desk) . . . . . . . . . . . . . . . .       23
        7.4.1. CU-03: Realizar Check-in . . . . . . . . . . . . . . . . . . . . . . . . . .      23



HOTELES                                                                         Diseño de software
Índice de Contenidos                                                                               II


        7.4.2. CU-04: Procesar Check-out . . . . . . . . . . . . . . . . . . . . . . . . .         23
        7.4.3. CU-14: Consultar Estado de Cuenta / Mantener Folio . . . . . . . . . . . .          24
   7.5. Especificación de Casos de Uso (Módulo Operativo) . . . . . . . . . . . . . . . .          25
        7.5.1. CU-05: Registrar Daños . . . . . . . . . . . . . . . . . . . . . . . . . . .        25
        7.5.2. CU-06: Vender Alcohol (Cafetería / Eventos) . . . . . . . . . . . . . . . .         25
        7.5.3. CU-07: Cobrar Desayuno Local . . . . . . . . . . . . . . . . . . . . . . .          25
        7.5.4. CU-08: Generar Comanda Room Service . . . . . . . . . . . . . . . . . .             26
        7.5.5. CU-15: Consultar Desayuno (Auditoría Rápida) . . . . . . . . . . . . . . .          26
   7.6. Especificación de Casos de Uso (Módulo Administración) . . . . . . . . . . . . .           27
        7.6.1. CU-09: Gestionar Catálogo de Habitaciones . . . . . . . . . . . . . . . . .         27
        7.6.2. CU-10: Actualizar Tarifas . . . . . . . . . . . . . . . . . . . . . . . . . .       27
        7.6.3. CU-11: Configurar Sucursales . . . . . . . . . . . . . . . . . . . . . . . .        27
        7.6.4. CU-12: Visualizar Panel Eventos . . . . . . . . . . . . . . . . . . . . . . .       28

8. Diagramas de Secuencia                                                                          29
   8.1. CU-01: Realizar Reserva . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      29
   8.2. CU-02: Cancelar Reserva . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      30
   8.3. CU-03: Realizar Check-in . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .       31
   8.4. CU-04: Procesar Check-out . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      32
   8.5. CU-05: Registrar Daños . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .       33
   8.6. CU-06: Vender Alcohol . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      34
   8.7. CU-07: Cobrar Desayuno Local . . . . . . . . . . . . . . . . . . . . . . . . . . .         35
   8.8. CU-08: Generar Comanda Room Service . . . . . . . . . . . . . . . . . . . . . .            36
   8.9. CU-09: Gestionar Catálogo de Habitaciones . . . . . . . . . . . . . . . . . . . . .        37
   8.10. CU-10: Actualizar Tarifas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   38
   8.11. CU-11: Configurar Sucursales . . . . . . . . . . . . . . . . . . . . . . . . . . . .      39
   8.12. CU-12: Visualizar Panel Eventos . . . . . . . . . . . . . . . . . . . . . . . . . . .     40
   8.13. CU-13: Buscar Disponibilidad . . . . . . . . . . . . . . . . . . . . . . . . . . . .      41
   8.14. CU-14: Consultar Estado de Cuenta / Folio . . . . . . . . . . . . . . . . . . . . .       42
   8.15. CU-15: Consultar Desayuno (Auditoría Rápida) . . . . . . . . . . . . . . . . . . .        43

9. Diagrama de Clases                                                                              44
   9.1. Núcleo del Sistema (Core Hotelero) . . . . . . . . . . . . . . . . . . . . . . . . .       44
   9.2. Recursos Humanos: El Patrón Strategy . . . . . . . . . . . . . . . . . . . . . . . .       45
   9.3. Finanzas y Cobros: Extensibilidad Total . . . . . . . . . . . . . . . . . . . . . . .      45
   9.4. Operaciones e Inventario: Trazabilidad . . . . . . . . . . . . . . . . . . . . . . . .     46
   9.5. Capas Transversales (Seguridad y Notificaciones) . . . . . . . . . . . . . . . . . .       46

10. Diagramas de Actividad (Flujos de Proceso de Negocio)                                          47
    10.1. Diagrama de Actividad: CU-01 Realizar Reserva . . . . . . . . . . . . . . . . . .        47
    10.2. Diagrama de Actividad: CU-04 Procesar Check-out . . . . . . . . . . . . . . . . .        49
    10.3. Diagrama de Actividad: CU-05 Registrar Daños y Multas . . . . . . . . . . . . . .        50
    10.4. Diagrama de Actividad: CU-06 Vender Alcohol (Restricción de Edad) . . . . . . .          50




HOTELES                                                                           Diseño de software
Contexto y Problemática                                                                             1



1.        Contexto y Problemática
1.1.     Descripción del Problema y Necesidad del Sistema
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


1.2.     Alcance del Proyecto
   El sistema propuesto abarcará la gestión integral del ciclo de vida del huésped y la administra-
ción de los recursos hoteleros. Sus fronteras operativas incluyen:

       Gestión de Reservas y Habitaciones: Control de inventario en tiempo real para tres catego-
       rías de habitaciones (Estándar, Plus, Suite Ejecutiva), previniendo conflictos de concurrencia.

       Gestión de Servicios Adicionales: Administración de modalidades de desayuno (en habita-
       ción o cafetería) y orquestación de eventos privados en Suites Ejecutivas (con límite de 25
       asistentes y validación legal de consumo de alcohol).

       Motor de Facturación Consolidada: Generación de un folio único por huésped que centra-
       lice el costo de la habitación, consumos extra y posibles penalizaciones (daños).

       Control de Accesos: Autenticación y autorización basada en roles (RBAC) para huéspedes,
       recepcionistas y administradores.


1.3.     Limitaciones y Exclusiones (Fuera de Alcance)
   Para mantener la alta cohesión del sistema y respetar el Principio de Responsabilidad Única
(SRP) a nivel de arquitectura, se establecen las siguientes limitaciones:

       Procesamiento de Pagos: El sistema no almacenará ni procesará directamente información
       de tarjetas de crédito. Se integrará con una Pasarela de Pagos externa, delegando el cumpli-
       miento estricto de la normativa PCI-DSS.



HOTELES                                                                            Diseño de software
Contexto y Problemática                                                                          2


       Emisión Tributaria: La generación legal de boletas y facturas electrónicas (DTE) será dele-
       gada mediante integración directa a los servicios del Servicio de Impuestos Internos (SII).

       Gestión de Recursos Humanos e Inventario Físico: El control de turnos del personal, liqui-
       daciones de sueldo y el control de stock de insumos físicos (bodega de alimentos o limpieza)
       quedan excluidos de esta plataforma.


1.4.     Oportunidades del Proyecto
   La adopción de esta plataforma centralizada, construida bajo principios de Clean Architecture
y patrones de diseño estructurados, abre oportunidades estratégicas a mediano plazo:

       Escalabilidad Geográfica: La arquitectura permitirá incorporar nuevas sucursales al sistema
       de manera transparente, sin requerir reescritura de código (cumpliendo el principio Open/-
       Closed).

       Minería de Datos: La centralización de la información habilitará futuros análisis de inteli-
       gencia de negocios (BI) para predecir temporadas altas, optimizar precios (precios dinámi-
       cos) y personalizar ofertas basadas en el historial del huésped.




HOTELES                                                                         Diseño de software
Requisitos funcionales                                                                              3


2.      Requisitos funcionales
2.1.    Búsqueda y gestión de reservas
  1. Selección de Sucursal
     El sistema exigirá al usuario seleccionar una sucursal (Temuco, Pucón, Santiago o Viña del
     Mar) antes de iniciar la búsqueda, con el fin de segmentar el inventario y mostrar disponibi-
     lidad precisa por ubicación.

  2. Filtrado de Disponibilidad
     El sistema habilitará un motor de búsqueda que filtrará las habitaciones disponibles exigiendo
     el ingreso de fechas de estadía y cantidad de huéspedes, previniendo conflictos de sobreventa.

  3. Sugerencia de Categoría
     El sistema sugerirá dinámicamente la categoría de la habitación (.Estándar", "Plus.o .Ejecutiva")
     en función del número de huéspedes ingresado, garantizando el cumplimiento normativo del
     aforo máximo por unidad.

  4. Captura de Datos Personales
     El sistema requerirá el registro de los datos del titular durante la confirmación, capturando de
     forma obligatoria la nacionalidad y el tipo de documento (RUT o Pasaporte) para mantener
     la integridad de la base de datos.

  5. Integración de Pasarela y Bloqueo Transaccional
     El sistema conectará con una pasarela de pagos externa para procesar la transacción, aplican-
     do simultáneamente un bloqueo temporal (timeout) sobre la habitación en el inventario. En
     caso de fallo en el cobro o expiración del tiempo asignado, la plataforma liberará la unidad
     automáticamente, garantizando la consistencia de los datos y previniendo la sobreventa por
     concurrencia.

  6. Notificación Transaccional Automatizada
     El sistema gatillará el despacho automático de una notificación electrónica (vía email o men-
     sajería) una vez confirmado el procesamiento exitoso del pago, integrando el comprobante
     digital, el código único de reserva y el desglose detallado de servicios. Esta funcionalidad
     asegura la entrega inmediata de la documentación respaldatoria al huésped, mejorando la
     transparencia del proceso y formalizando el vínculo contractual de manera instantánea.

  7. Gestión de Reservas
     El sistema permitirá a clientes y personal la anulación o reprogramación de reservas confir-
     madas, actualizando automáticamente el inventario para liberar la disponibilidad.

  8. Notificación Automatizada de Cancelación
     El sistema gatillará el despacho automático de una notificación electrónica al titular frente
     a cualquier evento de anulación de reserva, independientemente de si la acción es ejecutada
     a través del portal del usuario o mediante la interfaz de administración. Este componente




HOTELES                                                                            Diseño de software
Requisitos funcionales                                                                         4


       confirma formalmente la finalización del acuerdo de estadía y asegura la transparencia y
       trazabilidad en la comunicación operativa.


2.2.     Gestión de Desayunos y Cafetería
  1. Bonificación de Desayuno
     El sistema consultará el historial del usuario durante la reserva y, si cumple con los pará-
     metros de fidelización, bonificará automáticamente el ítem de desayuno dejándolo a costo
     cero.

  2. Verificación de Servicios
     El sistema proveerá una interfaz para que el personal verifique, mediante RUT o número de
     habitación, el estado de pago del desayuno, agilizando el control de acceso a la cafetería.

  3. Transacción de Desayunos
     El sistema habilitará el cobro de desayunos en el POS, validando mediante una regla de
     negocio que la transacción se ejecute exclusivamente dentro del horario operativo (07:00 a
     10:30 hrs).

  4. Control de Edad en POS
     El sistema requerirá la validación explícita de mayoría de edad (18+) mediante una casilla
     de verificación antes de habilitar la facturación de cualquier ítem catalogado como ’Bebidas
     Alcohólicas’.


2.3.     Gestión de Eventos Privados (Exclusivo Suite Ejecutiva)
  1. Adición de Eventos
     El sistema permitirá anexar eventos privados a las Suites Ejecutivas, sujeto a una valida-
     ción temporal que exige un margen superior a 48 horas previas al check-in para asegurar la
     viabilidad logística.

  2. Selección y Responsabilidad Legal
     El sistema exigirá la parametrización de bebidas alcohólicas y condicionará el procesamiento
     del pago a la aceptación obligatoria de los términos de responsabilidad legal por parte del
     cliente.

  3. Tarificación de Eventos
     El sistema sumará automáticamente los recargos correspondientes al evento privado directa-
     mente al costo base de la reserva de la suite, centralizando el cobro.

  4. Dashboard Operativo
     El sistema proveerá un panel de control para el área de operaciones que listará las reservas
     con eventos privados, consolidando información como fecha, aforo y bebidas para facilitar
     su preparación.




HOTELES                                                                       Diseño de software
Requisitos funcionales                                                                               5


2.4.    Operación del Hotel (Folio, Daños y Check-out)
  1. Flujo de Check-in
     El sistema bloqueará la entrega de llaves hasta que el recepcionista registre el documento
     (RUT/Pasaporte) de todos los acompañantes y consolide un método de garantía financiera en
     la plataforma.

  2. Consolidación de Folio
     El sistema instanciará una cuenta centralizada (folio) por reserva, la cual sumará de forma
     automática la tarifa base y los cargos dinámicos (consumos extras, multas) generados durante
     la estadía.

  3. Imputación de Daños
     El sistema permitirá al personal levantar reportes de daños físicos en la habitación, gatillando
     la imputación automática de un recargo compensatorio al folio consolidado del huésped.

  4. Motor de Tarificación y Liquidación Secuencial
     El sistema ejecutará un motor de cálculo que consolidará el monto total de la reserva mediante
     un flujo estructurado: primero adicionará recargos por capacidad excedida; luego aplicará de
     forma excluyente la promoción más favorable para el cliente; y finalmente, eximirá el 19 % de
     IVA si el titular acredita nacionalidad extranjera y utiliza una tarjeta de crédito internacional.
     Esta lógica asegura la exactitud comercial, previene el apilamiento de descuentos y garantiza
     el cumplimiento de las franquicias tributarias vigentes.

  5. Liquidación de Check-out
     El sistema habilitará la liquidación del folio al momento de la salida, totalizando los cobros
     base y recargos adicionales para emitir el monto exacto final.

  6. Emisión de Comprobantes
     El sistema generará automáticamente los documentos tributarios (boleta o factura) como res-
     puesta a cualquier transacción procesada, asegurando el cumplimiento fiscal.


2.5.    Administración del Sistema
  1. Gestión de Inventario
     El sistema habilitará un módulo de administración (CRUD) para que los usuarios autorizados
     gestionen las habitaciones y actualicen los precios base de las distintas categorías.




HOTELES                                                                            Diseño de software
Requisitos No Funcionales                                                                      6


3.      Requisitos No Funcionales
3.1.    Rendimiento y Eficiencia
  1. Tiempo de Respuesta Transaccional
     El sistema procesará las consultas de disponibilidad en un tiempo máximo de 2 segundos
     bajo una concurrencia de 500 usuarios simultáneos (excluyendo latencia de APIs externas),
     garantizando una experiencia de reserva fluida y evitando el abandono del flujo.
  2. Carga Rápida de Interfaz
     El sistema renderizará la vista principal de la aplicación web en un tiempo máximo de 2.5
     segundos bajo conexiones de red móvil 4G, asegurando una interacción eficiente para los
     huéspedes en tránsito.
  3. Escalado Automático (Auto-scaling)
     El sistema implementará un escalado elástico en su infraestructura para soportar incrementos
     de tráfico de hasta un 300 % durante temporadas de alta demanda (ej. Pucón, Viña del Mar),
     manteniendo inalterables los tiempos de respuesta operativos.


3.2.    Seguridad y Privacidad
  4. Cumplimiento de Privacidad Legal
     El sistema protegerá el almacenamiento y tratamiento de datos personales en estricto cumpli-
     miento de la Ley 19.628 de Chile, garantizando su confidencialidad y bloqueando cualquier
     uso con fines comerciales sin consentimiento explícito.
  5. Integración PCI-DSS
     El sistema delegará el procesamiento financiero a pasarelas de pago tokenizadas, prohibiendo
     estrictamente el almacenamiento de tarjetas de crédito en servidores propios para anular el
     riesgo de vulneraciones económicas.
  6. Cifrado de Datos en Tránsito
     El sistema transmitirá toda credencial e información personal obligatoriamente a través del
     protocolo HTTPS con algoritmos de cifrado TLS 1.2 o superior, asegurando la integridad de
     la red.
  7. Control de Accesos (RBAC)
     El sistema aplicará un modelo de autorización estricto basado en roles para delimitar privi-
     legios operacionales (ej. lectura vs. escritura en consumos), previniendo modificaciones no
     autorizadas en módulos ajenos a la competencia del actor.


3.3.    Usabilidad y Experiencia de Usuario
  8. Eficiencia de Navegación Mobile-First
     El sistema presentará una interfaz diseñada bajo un enfoque "Mobile-First"que permitirá



HOTELES                                                                       Diseño de software
Requisitos No Funcionales                                                                          7


       completar flujos críticos (ej. solicitud de servicios o eventos) en un máximo de 3 interaccio-
       nes, optimizando la agilidad de uso.

  9. Accesibilidad Inclusiva
     El sistema estructurará sus interfaces web cumpliendo rigurosamente el nivel AA de las direc-
     trices WCAG 2.1, aplicando contrastes y legibilidad tipográfica para asegurar la operatividad
     de personas con discapacidad visual.

 10. Retroalimentación de Interfaz
     El sistema proveerá confirmaciones visuales inmediatas (inferior a 1 segundo) en la pantalla
     tras la ejecución de acciones críticas, otorgando certeza técnica al usuario sobre el éxito o
     fallo de la transacción.


3.4.     Mantenibilidad y Soportabilidad
 11. Arquitectura Desacoplada (API RESTful)
     El sistema desacoplará la capa de presentación de la lógica de negocio mediante comunica-
     ción exclusiva por API RESTful documentada (Swagger/OpenAPI), facilitando el manteni-
     miento y la escalabilidad del código.

 12. Registro de Eventos (Logging)
     El sistema generará registros estructurados y automatizados para cada excepción o error de
     servidor, asegurando la trazabilidad y agilizando la resolución de incidentes (troubleshooting)
     por parte del equipo de soporte.

 13. Despliegues sin Interrupción (Zero-Downtime)
     El sistema ejecutará actualizaciones de software en producción mediante flujos de desplie-
     gue continuo sin tiempo de inactividad, garantizando la disponibilidad ininterrumpida de los
     servicios.


3.5.     Disponibilidad y Confiabilidad
 14. Tolerancia a Fallos Offline (POS)
     El sistema dotará a los módulos de Punto de Venta de un modo offline alimentado por una
     caché local diaria de huéspedes, permitiendo registrar ventas durante caídas de red y retrans-
     mitiéndolas automáticamente al servidor al recuperar conectividad.

 15. Políticas de Respaldo (Disaster Recovery)
     El sistema ejecutará de forma automática copias de seguridad incrementales cada 4 horas y
     un respaldo completo (full backup) diario de la base de datos transaccional, garantizando una
     recuperación rápida ante contingencias graves.




HOTELES                                                                           Diseño de software
Requisitos No Funcionales                                                                       8


3.6.    Portabilidad y Compatibilidad
 16. Soporte Multi-Navegador
     El sistema renderizará su plataforma web de manera consistente en las versiones estables más
     recientes de los navegadores predominantes (Chrome, Safari, Firefox, Edge), asegurando un
     acceso universal.

 17. Compatibilidad Multi-Plataforma
     El sistema operará con total compatibilidad funcional tanto en entornos de escritorio admi-
     nistrativos (Windows, macOS) como en ecosistemas móviles de clientes (iOS, Android).




HOTELES                                                                        Diseño de software
Reglas de Negocio                                                                                9


4.      Reglas de Negocio
     RN-01: Restricción de Sucursales
     Descripción: El sistema operativo de reservas está limitado a los establecimientos físicos
     ubicados exclusivamente en Temuco, Pucón, Santiago y Viña del Mar.
     Efecto: El sistema debe limitar la búsqueda de disponibilidad y la creación de reservas úni-
     camente a estas cuatro localidades.

     RN-02: Capacidad Máxima - Habitación Estándar
     Descripción: Las habitaciones de categoría .Estándar"tienen una restricción estricta de aloja-
     miento para un máximo de dos (2) huéspedes.
     Efecto: El motor de reservas debe bloquear cualquier intento de reserva de esta categoría si
     la cantidad de pasajeros ingresada es mayor a 2.

     RN-03: Capacidad Máxima - Habitación Plus
     Descripción: Las habitaciones de categoría "Plus.están habilitadas para alojar hasta un máxi-
     mo de cuatro (4) huéspedes.
     Efecto: El motor de reservas debe bloquear cualquier intento de reserva de esta categoría si
     la cantidad de pasajeros ingresada es mayor a 4.

     RN-04: Capacidad Base - Suite Ejecutiva
     Descripción: La "Suite Ejecutiva"permite el pernocte de hasta un máximo de ocho (8) hués-
     pedes en condiciones normales de alojamiento.
     Efecto: El sistema validará que los pasajeros registrados para dormir en la habitación no
     superen los 8 individuos.

     RN-05: Realización de Eventos Privados (Exclusividad)
     Descripción: La opción de organizar eventos privados es un servicio exclusivo de la "Suite
     Ejecutiva". No está disponible para las categorías Estándar ni Plus.
     Efecto: La interfaz de reserva solo debe habilitar el check-box o la opción de .Añadir Evento
     Privadoçuando el cliente haya seleccionado una Suite Ejecutiva.

     RN-06: Capacidad Máxima de Asistentes para Eventos
     Descripción: Los eventos privados en la Suite Ejecutiva tienen un límite estricto de aforo de
     veinticinco (25) asistentes.
     Efecto: Al registrar un evento asociado a la reserva, el sistema debe impedir ingresar un
     número de invitados superior a 25.

     RN-07: Recargo por Evento Privado y Provisión de Alcohol
     Descripción: La contratación de un evento privado conlleva un recargo económico adicional
     que incluye la provisión de bebidas alcohólicas a elección del cliente.
     Efecto: Si la opción de evento es seleccionada, el sistema debe sumar automáticamente el
     Recargo por Evento.al total a pagar en el momento de efectuar la reserva, y desplegar un
     módulo para la selección del tipo de bebidas.




HOTELES                                                                         Diseño de software
Reglas de Negocio                                                                                10


     RN-08: Modalidad de Entrega del Desayuno en Reserva
     Descripción: Si un huésped decide incluir el servicio de desayuno al momento de hacer la
     reserva, es obligatorio que defina dónde desea recibirlo.
     Efecto: Si el ítem "Desayuno"se añade al carrito de reserva, el sistema debe exigir seleccionar
     entre las variables EN_HABITACION o EN_CAFETERIA antes de procesar el pago.

     RN-09: Flexibilidad de Desayuno No Incluido
     Descripción: Todo huésped activo que no haya prepagado el desayuno en su reserva original
     conserva el derecho de consumirlo en la cafetería del hotel mediante pago directo.
     Efecto: El sistema de Punto de Venta (POS) de las cafeterías debe operar de forma indepen-
     diente al prepago de reservas, permitiendo facturar servicios directamente en caja a clientes
     alojados.

     RN-10: Penalización Compensatoria por Daños Patrimoniales
     Descripción: Cualquier daño comprobable ocasionado a la propiedad, infraestructura o mo-
     biliario del hotel por parte de los huéspedes o sus invitados (durante estadías o eventos)
     generará un cobro compensatorio.
     Efecto: El sistema de gestión interna (PMS) debe permitir a los administradores del hotel
     añadir manualmente cargos bajo el concepto "Daños Patrimoniales.a la cuenta del cliente,
     asegurando que este saldo deba ser liquidado obligatoriamente antes o durante el proceso de
     check-out.

     RN-11: Restricción de Edad para Eventos con Alcohol
     Descripción: Dado que los eventos privados en la Suite Ejecutiva incluyen la provisión de
     bebidas alcohólicas, el titular de la reserva debe ser mayor de edad según la legislación vi-
     gente (18 años).
     Efecto: El sistema debe calcular la edad del huésped titular a partir de su fecha de nacimien-
     to durante el registro; si es menor de 18 años, el botón para .Añadir Evento Privado"debe
     deshabilitarse o arrojar una excepción de validación.

     RN-12: Retención de Garantía Patrimonial
     Descripción: Para respaldar la política de protección patrimonial (RN-10), es obligatorio
     registrar una tarjeta de crédito como garantía o retener un depósito de seguridad al momento
     del check-in.
     Efecto: El sistema impedirá que el estado de la reserva pase a Ïn House"(Huésped en casa)
     si no se ha registrado un token de pago válido o un comprobante de depósito en la base de
     datos relacional.

     RN-13: Tiempo de Antelación para Eventos Privados
     Descripción: La logística de un evento privado (preparación de la Suite Ejecutiva y provisión
     de alcohol) requiere tiempo. Por lo tanto, no se pueden añadir eventos a reservas creadas para
     el mismo día.
     Efecto: El sistema debe validar que la fecha de inicio del evento tenga al menos un margen
     de 48 horas respecto a la fecha y hora actual (Timestamp) del servidor.




HOTELES                                                                          Diseño de software
Reglas de Negocio                                                                                11


     RN-14: Control de Inventario (Overbooking Cero)
     Descripción: El hotel no permite la sobreventa de habitaciones bajo ninguna circunstancia.
     Efecto: Antes de confirmar y procesar el pago de cualquier reserva, el sistema debe ejecu-
     tar una transacción en la base de datos para asegurar que Total Habitaciones Disponibles -
     Habitaciones Solicitadas ≥ 0 para las fechas seleccionadas en esa sucursal específica.

     RN-15: Límite Horario del Servicio de Desayuno
     Descripción: El servicio de desayuno, ya sea en la habitación o en la cafetería, opera dentro
     de una ventana de tiempo predefinida (por ejemplo, de 07:00 a 10:30 hrs).
     Efecto: El módulo del restaurante/cafetería en el sistema no debe permitir facturar ítems bajo
     la categoría "Desayuno"fuera de este bloque horario, redirigiendo las peticiones al menú de
     servicio regular o Room Service.

     RN-16: Tarifa Base vs. Huéspedes Adicionales
     Descripción: Aunque las habitaciones Plus y Ejecutiva tienen capacidades máximas de 4 y
     8 personas respectivamente, la tarifa base de la habitación incluye un número fijo de huéspe-
     des (ej. 2 personas). Cualquier huésped por encima del límite base incurre en un cobro por
     "Persona Extra".
     Efecto: El motor de reservas debe calcular dinámicamente el precio total multiplicando el
     cargo de persona extra por cada pasajero que exceda el número base establecido para esa
     categoría de habitación.

     RN-17: Descuento por Larga Estadía (Long Stay)
     Descripción: Las reservas que contemplen siete (7) o más noches consecutivas en una misma
     sucursal recibirán automáticamente un 15 % de descuento sobre la tarifa base de la habita-
     ción.
     Efecto: El motor de reservas evaluará la variable cantidad_noches. Si cantidad_noches ≥
     7, aplicará un multiplicador de 0.85 exclusivamente al subtotal del alojamiento (excluyendo
     recargos por eventos o consumos en cafetería).

     RN-18: Descuento por Reserva Anticipada (Early Bird)
     Descripción: Para fomentar la planificación, las reservas confirmadas y pagadas con más de
     sesenta (60) días de anticipación a la fecha de check-in obtienen un 10 % de descuento.
     Efecto: El sistema calculará la diferencia entre el Timestamp de creación de la reserva y la
     fecha_checkin. Si la diferencia es mayor o igual a 60 días, aplicará el descuento al total del
     carrito.

     RN-19: Descuento Cruzado por Evento Privado (Cross-Selling)
     Descripción: Si un cliente contrata una Suite Ejecutiva con la opción de .Evento Privado"habilitada,
     y dentro de la misma transacción reserva habitaciones adicionales (Estándar o Plus) para sus
     invitados, obtendrá un 20 % de descuento sobre la tarifa de esas habitaciones adicionales.
     Efecto: El sistema agrupará las habitaciones bajo un mismo ID_Reserva. Si detecta la pre-
     sencia del flag evento_privado = true en la Suite Ejecutiva, aplicará el descuento a los demás
     objetos tipo Habitacion dentro de ese mismo ID.




HOTELES                                                                          Diseño de software
Reglas de Negocio                                                                                 12


     RN-20: Restricción de Acumulación de Descuentos
     Descripción: Los descuentos promocionales (Larga Estadía, Early Bird, Descuento Cruza-
     do) son estrictamente no acumulables entre sí para evitar pérdidas comerciales.
     Efecto: El algoritmo de facturación (Pricing Engine) debe calcular todos los descuentos apli-
     cables al carrito, seleccionar únicamente el que represente el mayor ahorro económico para
     el cliente, y descartar el resto.

     RN-21: Política de Cancelación Gratuita
     Descripción: Los clientes pueden cancelar su reserva sin costo alguno siempre y cuando lo
     hagan con al menos 48 horas de anticipación a la hora oficial de check-in (15:00 hrs).
     Efecto: Si la petición de cancelación ingresa cumpliendo el margen de 48 horas, el siste-
     ma cambiará el estado de la reserva a Çancelada", liberará el inventario de la habitación y
     ejecutará una orden de reembolso automático (o liberación de la garantía de la RN-12) a la
     pasarela de pagos.

     RN-22: Penalización por Cancelación Tardía
     Descripción: Las cancelaciones realizadas con menos de 48 horas de anticipación incurren
     en una penalidad equivalente al cobro de la primera noche de alojamiento.
     Efecto: El sistema retendrá el monto correspondiente a una (1) noche de la tarifa reservada,
     reembolsará el excedente (si aplica), y liberará la habitación para nuevas ventas.

     RN-23: Política de Inasistencia (No-Show)
     Descripción: Si el huésped no se presenta en la recepción antes de las 23:59 hrs del día
     programado para su check-in y no ha notificado retraso, la reserva se considera abandonada.
     Efecto: Un proceso automático (cron job o batch process) a las 00:00 hrs cambiará el estado
     de estas reservas a "No-Show", procesará el cobro de penalidad (primera noche) a la tarjeta
     en garantía, y cancelará los días restantes de la reserva para liberar disponibilidad.

     RN-24: Restricción Universal de Venta de Alcohol
     Descripción: La venta y suministro de bebidas alcohólicas está estrictamente prohibida para
     menores de 18 años, no solo en eventos privados, sino también en la cafetería, minibar y
     Room Service.
     Efecto: El sistema de Punto de Venta (POS) del hotel debe requerir que el cajero o el sistema
     marque una casilla de "Verificación de Identidad (18+).antes de permitir añadir cualquier ítem
     categorizado como Bebida Alcohólica a la cuenta de la habitación o boleta.

     RN-25: Cláusula de Responsabilidad en Eventos (Mayores y Menores)
     Descripción: Aunque el titular del evento en la Suite Ejecutiva sea mayor de edad (RN-
     11), el hotel se exime legalmente si el titular provee alcohol a menores asistentes al evento
     privado.
     Efecto: Al seleccionar la opción de .Añadir Evento Privado escoger alcohol, el sistema debe
                                                                 2

     inyectar obligatoriamente un check-box de .Acepto Términos de Responsabilidad Legal"que
     debe ser validado como true antes de habilitar el botón de pago. El estado de esta firma digital
     debe guardarse en la base de datos junto a la reserva.




HOTELES                                                                           Diseño de software
Reglas de Negocio                                                                              13


     RN-26: Registro Obligatorio de Acompañantes
     Descripción: Por ley y seguridad, no basta con los datos del titular que paga; todos los
     huéspedes que pernocten en la habitación (Estándar, Plus o Ejecutiva) deben estar individua-
     lizados con su documento de identidad.
     Efecto: El módulo de Check-in del sistema no permitirá cambiar el estado de la habitación
     a Ocupada ni emitir llaves magnéticas hasta que el arreglo de objetos Acompañantes[] tenga
     una longitud exactamente igual al número de pasajeros declarados en la reserva, cada uno
     con un RUT/Pasaporte válido.

     RN-27: Políticas de Late Check-out
     Descripción: El horario estándar de salida (Check-out) es a las 12:00 hrs. Los clientes que
     extiendan su estadía en la habitación hasta las 16:00 hrs incurren en un cargo automático por
     salida tardía.
     Efecto: Si el proceso de Check-out se registra en el sistema después de las 12:00 hrs y
     hasta las 16:00 hrs, el sistema debe inyectar automáticamente un cargo por concepto de ’Late
     Check-out’ en el folio consolidado de la reserva antes de permitir emitir el comprobante de
     pago.




HOTELES                                                                        Diseño de software
Identificación de Stakeholders y Actores                                                                                14



5.       Identificación de Stakeholders y Actores
     Para garantizar que el sistema satisfaga las necesidades de todos los involucrados, se han cla-
sificado los interesados según su tipo (Interno/Externo) y su nivel de implicación en la operación
(Primario/Secundario). A continuación, se detallan sus perfiles, objetivos y necesidades técnicas.


5.1.     Actores Primarios (Usuarios Directos)

 Actor                       Tipo      Perfil y Descripción        Objetivos en el Siste-       Necesidades y Expec-
                                                                   ma                           tativas
 Huésped / Cliente           Externo   Persona que contrata        Gestionar reservas, per-     Interfaz intuitiva, con-
                                       los servicios de la cade-   sonalizar su estadía (de-    firmaciones inmediatas,
                                       na. Valora la autonomía     sayunos, eventos) y rea-     seguridad en el manejo
                                       y la rapidez.               lizar pagos.                 de datos personales y fi-
                                                                                                nancieros.
 Recepcionista               Interno   Personal operativo de       Administrar el ciclo         Flujos de trabajo ági-
                                       primera línea en las su-    de estadía (Check-           les, consolidación auto-
                                       cursales.                   in/Check-out), gestio-       mática de cobros y vi-
                                                                   nar folios y asignar         sibilidad del inventario
                                                                   habitaciones.                en tiempo real.
 Personal de Cafetería       Interno   Responsable de la pro-      Visualizar pedidos de        Listados de pedidos
                                       visión de alimentos en      desayuno vinculados a        claros, notificaciones
                                       el local o habitaciones.    habitaciones y confir-       de cambios en tiempo
                                                                   mar entregas.                real y registro sencillo
                                                                                                de consumos extra.
 Personal de Mantenimiento   Interno   Encargado del estado        Reportar daños encon-        Acceso móvil o rápido
                                       físico y limpieza de las    trados y actualizar el es-   para cambio de estados
                                       habitaciones.               tado de disponibilidad       (Limpio/Sucio/En Re-
                                                                   de la habitación.            paración) y registro de
                                                                                                evidencia de daños.




HOTELES                                                                                            Diseño de software
Identificación de Stakeholders y Actores                                                                                       15


5.2.       Actores Secundarios e Interesados (Sistemas y Gestión)

 Actor                                  Tipo      Perfil y Descripción        Objetivos en el Siste-     Necesidades y Expec-
                                                                              ma                         tativas
 Administrador del Hotel                Interno   Perfil gerencial con au-    Supervisar métricas de     Reportes de auditoría,
                                                  toridad sobre la confi-     ocupación, gestionar ta-   paneles de control
                                                  guración del sistema.       rifas, reglas de negocio   (dashboards) y gestión
                                                                              y usuarios.                centralizada de las 4
                                                                                                         sucursales.
 Pasarela de Pagos (API)                Externo   Sistema externo encar-      Procesar cobros y ges-     Cumplimiento de pro-
                                                  gado de la validación fi-   tionar la tokenización     tocolos de seguridad,
                                                  nanciera.                   de tarjetas.               baja latencia en la co-
                                                                                                         municación y manejo
                                                                                                         de excepciones finan-
                                                                                                         cieras.
 Servicio de Impuestos Internos (SII)   Externo   Ente regulador tributa-     Recibir la información     Integración     estanda-
                                                  rio.                        necesaria para la vali-    rizada, integridad de
                                                                              dación de documentos       datos fiscales y cumpli-
                                                                              tributarios electrónicos   miento de la normativa
                                                                              (DTE).                     legal vigente.



5.3.       Matriz de Relaciones y Nivel de Implicación
   Para priorizar el diseño de la interfaz y la lógica de negocio, se define la siguiente jerarquía de
impacto:

         Implicación Crítica: Huésped y Recepcionista. Su interacción define el éxito operativo in-
         mediato. El sistema debe priorizar la disponibilidad y usabilidad para estos roles.

         Implicación Operativa: Personal de Cafetería y Mantenimiento. Garantizan la calidad del
         servicio. Su necesidad principal es la precisión de la información compartida.

         Implicación Estratégica: Administrador. Define las reglas que rigen el sistema. Su foco es
         el control y la escalabilidad del negocio.

         Implicación Técnica/Legal: Pasarela de Pagos y SII. Actores externos que imponen restric-
         ciones de seguridad y cumplimiento legal que el sistema debe observar de forma obligatoria.




HOTELES                                                                                                   Diseño de software
Diagrama de Contexto (Nivel 0)                                                                     16


6.        Diagrama de Contexto (Nivel 0)
    El Diagrama de Contexto establece los límites de la solución y define cómo el Sistema Core
Hotelero interactúa con su entorno. En este nivel, el sistema se trata como una çaja negra", centran-
do la atención en los flujos de información que entran y salen hacia los actores y sistemas externos
definidos anteriormente.


6.1.     Definición de Fronteras y Delegación de Responsabilidades
    Una decisión de diseño crítica en esta arquitectura es la delegación de dominios de alta com-
plejidad y riesgo:

       Seguridad Financiera: El sistema delega la captura y procesamiento de datos sensibles de
       tarjetas a la Pasarela de Pagos, asegurando que el Core no sea sujeto de auditorías PCI-DSS
       directas.

       Cumplimiento Tributario: El sistema no calcula la validez fiscal ni genera el documento
       legal; envía los datos crudos al SII y recibe la confirmación/documento tributario electrónico.


6.2.     Representación del Diagrama de Contexto
   A continuación, se presenta la representación visual de las interacciones principales del sistema
centralizado:




                  Figura 6.1: Diagrama de Contexto (Nivel 0) del Sistema Hotele-
                  ro




HOTELES                                                                            Diseño de software
Diagrama de Contexto (Nivel 0)                                                                    17


6.3.     Descripción de Flujos de Datos Críticos
    Para asegurar la transparencia y el control, se detallan los intercambios de información más
relevantes:

       Sincronización de Inventario (Entrada): El sistema recibe peticiones de disponibilidad
       desde la interfaz del Huésped, validando en milisegundos el estado de las 4 sucursales para
       evitar la sobreventa.

       Orquestación de Cobro (Salida/Entrada): Ante una reserva o check-out, el sistema envía
       el monto total (habitación + consumos + recargos) a la Pasarela de Pagos. Esta devuelve un
       código de autorización que el sistema vincula al folio del huésped.

       Validación Tributaria (Salida/Entrada): Al finalizar el ciclo de pago, el sistema comunica
       al SII el desglose de la venta. El sistema recibe y almacena el documento tributario electró-
       nico (DTE), poniéndolo a disposición del huésped para su descarga.

       Gestión de Reglas de Negocio (Entrada): El Administrador inyecta las políticas operativas
       (ej. tarifas, reglas de aforo, penalizaciones por daños) que el sistema procesa automáticamen-
       te para actualizar el balance del folio del cliente.




HOTELES                                                                           Diseño de software
Modelo de Casos de Uso del Sistema                                                              18


7.       Modelo de Casos de Uso del Sistema
    El diseño funcional del sistema se ha estructurado utilizando un enfoque modular, dividiendo
las interacciones en tres grandes dominios operativos: Módulo de Reservas, Módulo Front-Desk
y Módulo Operativo. Esta separación facilita la mantenibilidad y asignación de responsabilidades
dentro de la arquitectura.
    A continuación, se presenta el diagrama general de casos de uso, evidenciando las interacciones
primarias y la reutilización de lógica mediante relaciones de inclusión y extensión.


7.1.     Diagrama General de Casos de Uso (UML)
   La siguiente representación gráfica consolida la arquitectura funcional del sistema:




HOTELES                                                                         Diseño de software
Modelo de Casos de Uso del Sistema                                                        19




               Figura 7.1: Diagrama General de Casos de Uso del Sistema Ho-
               telero




HOTELES                                                                   Diseño de software
Modelo de Casos de Uso del Sistema                                                            20


7.2.     Análisis de Exhaustividad y Validación de Requerimientos
    El diagrama de casos de uso general presenta una arquitectura funcional altamente cohesiva,
validando de manera gráfica el cumplimiento de todas las reglas de negocio (BR) y requerimientos
funcionales (FR) del sistema:

       Coherencia Inter-Módulos: Se evidencia una trazabilidad perfecta mediante las relaciones
       de inclusión («include»). Por ejemplo, el registro de daños deriva obligatoriamente en un
       recargo que impacta el Folio Consolidado, asegurando integridad financiera.

       Representación de Complejidad: Las variaciones del flujo base se modelan mediante rela-
       ciones de extensión («extend»), permitiendo que casos como la Exención de IVA o Eventos
       Privados se acoplen sin alterar el flujo principal.

       Integridad Normativa: Las obligaciones legales (Verificar Edad 18+) y la comunicación
       con actores externos (Pasarela de Pagos y SII) están representadas explícitamente.




HOTELES                                                                       Diseño de software
Modelo de Casos de Uso del Sistema                                                                  21


7.3.     Especificación de Casos de Uso (Módulo de Reservas)
7.3.1.    CU-01: Realizar Reserva
   Actor Principal: Cliente / Huésped
Descripción: Permite a un cliente asegurar una o más habitaciones para fechas específicas.
Precondiciones: El cliente debe estar registrado o proveer sus datos básicos de contacto.
       Flujo Principal:
         1. Cliente solicita reservar fechas; el sistema ejecuta Buscar Disponibilidad.
         2. El sistema muestra habitaciones; el cliente selecciona una categoría.
         3. (Opcional) Se ejecutan extensiones para añadir Desayuno o Evento Privado.
         4. Cliente confirma total y provee datos de pago.
         5. El sistema ejecuta Registrar Garantía con la Pasarela de Pagos.
         6. El sistema genera ID de reserva y notifica al cliente.
       Flujos Alternativos: 3a. Sin disponibilidad (Sugerir nuevas fechas); 8a. Tarjeta rechazada
       (Solicitar nuevo método).

7.3.2.    CU-02: Cancelar Reserva
   Actor Principal: Cliente / Huésped
Descripción: Permite anular una reserva existente antes de la fecha de check-in.
Precondiciones: La reserva debe estar en estado Çonfirmada".
       Flujo Principal:
         1. El Cliente ingresa su número de reserva y RUT/Pasaporte.
         2. El sistema valida los datos y muestra el detalle.
         3. El Cliente confirma la anulación.
         4. El sistema evalúa las políticas de cancelación (ej. horas de anticipación).
         5. El sistema libera el inventario de la habitación.
         6. El sistema se comunica con la Pasarela de Pagos para liberar la garantía o aplicar el
            cobro porcentual por anulación tardía.
         7. El sistema envía correo de confirmación de anulación.

7.3.3.    CU-13: Buscar Disponibilidad
    Actor Principal: Cliente / Huésped
Descripción: Permite consultar el catálogo de habitaciones libres aplicando filtros de fecha, sucur-
sal y capacidad.
Precondiciones: Ninguna (Acceso público).



HOTELES                                                                             Diseño de software
Modelo de Casos de Uso del Sistema                                                              22


     Flujo Principal:

       1. El Cliente ingresa a la plataforma web y selecciona la sucursal de interés.
       2. Ingresa las fechas de Check-in y Check-out estimadas, y la cantidad de personas.
       3. El sistema cruza las fechas solicitadas con el inventario de la base de datos de esa
          sucursal.
       4. El sistema despliega un listado de habitaciones disponibles mostrando la tarifa dinámica
          actual.
       5. El Cliente visualiza el detalle, fotografías y amenidades de la habitación.

     Flujos Alternativos: 3a. Sin disponibilidad (Overbooking preventivo): Si la capacidad está
     al 100 %, el sistema no muestra errores, sino que sugiere fechas o sucursales cercanas.




HOTELES                                                                         Diseño de software
Modelo de Casos de Uso del Sistema                                                                  23


7.4.     Especificación de Casos de Uso (Módulo Front-Desk)
7.4.1.    CU-03: Realizar Check-in
   Actor Principal: Recepcionista
Descripción: Registra la llegada física y habilita el uso de la habitación.
Precondiciones: Debe existir una reserva confirmada para el día en curso.

       Flujo Principal:

         1. El Recepcionista busca la reserva en el sistema mediante RUT o código.
         2. El sistema muestra los detalles y solicita verificación de identidad física.
         3. El Recepcionista ejecuta el sub-flujo «include» Registrar Acompañantes.
         4. El sistema crea la entidad "Folio Activo.asociada a la habitación.
         5. El sistema emite la llave digital o tarjeta de acceso.
         6. El Recepcionista entrega la llave al huésped.

       Postcondiciones: Habitación cambia a .Ocupada folio queda habilitado para cargos extra.
                                                          2




7.4.2.    CU-04: Procesar Check-out
   Actor Principal: Recepcionista
Descripción: Cierra la estadía del huésped, consolida las deudas y emite el cobro final.
Precondiciones: El huésped debe tener un Folio Activo.

       Flujo Principal:

         1. El Recepcionista selecciona la habitación a procesar.
         2. El sistema ejecuta el sub-flujo «include» Mantener Folio para sumar habitación, cafete-
            ría y daños.
         3. (Opcional) Si el huésped entrega tarde, el sistema ejecuta «extend» Aplicar Cargo Late
            Check-out.
         4. (Opcional) Si el huésped es extranjero, el Recepcionista invoca «extend» Aplicar Exen-
            ción IVA.
         5. El sistema presenta el monto total a pagar.
         6. El Recepcionista procesa el pago a través de la Pasarela.
         7. El sistema ejecuta «include» Emitir Factura/DTE comunicándose con el SII.
         8. El sistema cambia el estado de la habitación a "Sucia/Para Limpieza".




HOTELES                                                                             Diseño de software
Modelo de Casos de Uso del Sistema                                                               24


7.4.3.    CU-14: Consultar Estado de Cuenta / Mantener Folio
   Actor Principal: Recepcionista
Descripción: Permite auditar el folio de un huésped en cualquier momento de su estadía.
Precondiciones: El huésped debe tener un Folio Activo.

     Flujo Principal:

         1. El Recepcionista busca la habitación o el RUT del titular.
         2. Selecciona la opción "Ver Folio Consolidado".
         3. El sistema recupera y lista cronológicamente todos los cargos enviados por los distintos
            módulos.
         4. El Recepcionista revisa el detalle junto al huésped.
         5. (Opcional) El Recepcionista exporta e imprime un PDF con el estado de cuenta parcial.

     Flujos Alternativos: 4a. Discrepancia de cobros: El Recepcionista visualiza la traza del
     usuario para iniciar auditoría, sin poder eliminar el cargo directamente.




HOTELES                                                                          Diseño de software
Modelo de Casos de Uso del Sistema                                                                  25


7.5.     Especificación de Casos de Uso (Módulo Operativo)
7.5.1.    CU-05: Registrar Daños
   Actor Principal: Staff Limpieza
Descripción: Permite reportar destrozos o faltantes encontrados tras la salida de un huésped.
Precondiciones: La habitación debe estar en estado "Sucia/Para Limpieza".

       Flujo Principal:

         1. El Staff inspecciona la habitación e ingresa al sistema (vía móvil).
         2. Selecciona la habitación y la opción Reportar Daño".
         3. Sube evidencia (fotografía/descripción) y categoriza el daño.
         4. El sistema evalúa y ejecuta internamente «include» Aplicar Multa.
         5. El sistema envía el cargo directamente a Mantener Folio de la última reserva.
         6. El sistema notifica al Recepcionista y al Administrador sobre la incidencia.

7.5.2.    CU-06: Vender Alcohol (Cafetería / Eventos)
   Actor Principal: Staff Cafetería
Descripción: Proceso de venta de bebidas con restricción legal de edad.
Precondiciones: El cliente debe solicitar una bebida alcohólica.

       Flujo Principal:

         1. El Staff selecciona la bebida en el sistema de punto de venta (POS) integrado.
         2. El sistema detecta la categoría .Alcohol bloquea exigiendo «include» Verificar Identi-
                                                     2

            dad.
         3. El Staff solicita el carnet físico e ingresa la fecha de nacimiento en el sistema.
         4. El sistema valida que sea mayor de 18 años.
         5. El Staff selecciona si el pago es al contado o cargado a la habitación.
         6. Si es con cargo, el sistema invoca «include» Mantener Folio.

       Flujos Alternativos: 4a. Menor de edad: El sistema arroja alerta bloqueante y el Staff niega
       la venta.

7.5.3.    CU-07: Cobrar Desayuno Local
   Actor Principal: Staff Cafetería
Descripción: Permite gestionar el consumo de desayuno validando pre-pagos.
Precondiciones: El sistema de cafetería debe estar sincronizado con Front-Desk.

       Flujo Principal:



HOTELES                                                                             Diseño de software
Modelo de Casos de Uso del Sistema                                                                     26


         1. El cliente se presenta y solicita el servicio.
         2. El Staff solicita el número de habitación y/o RUT.
         3. El sistema ejecuta el sub-flujo «include» Consultar Desayuno Incluido.
         4. El sistema confirma que el desayuno fue contratado durante la reserva.
         5. El Staff registra el consumo en el sistema a costo cero.
         6. El sistema descuenta las raciones del inventario diario.

      Flujos Alternativos: 4a. No incluido: Se cobra al contado emitiendo boleta, o se carga eje-
      cutando Mantener Folio.

7.5.4.    CU-08: Generar Comanda Room Service
   Actor Principal: Staff Cafetería
Descripción: Toma y procesa un pedido entregado directamente en la habitación.
Precondiciones: La habitación debe estar en estado .Ocupadaçon un folio activo.

      Flujo Principal:

         1. El Staff recibe la solicitud vía telefónica o mediante interfaz digital.
         2. Ingresa el número de habitación en el POS.
         3. El sistema valida el estado y muestra el nombre del titular.
         4. El Staff ingresa los ítems solicitados.
         5. El sistema calcula el subtotal y emite la orden de preparación a cocina.
         6. Una vez entregado, el Staff confirma y el sistema ejecuta «include» Mantener Folio.

7.5.5.    CU-15: Consultar Desayuno (Auditoría Rápida)
   Actor Principal: Staff Cafetería
Descripción: Permite verificar beneficios de habitación sin generar transacción.
Precondiciones: Sistema en línea con la base de datos central.

      Flujo Principal:

         1. El cliente llega a la entrada del comedor.
         2. El Staff solicita el número de habitación y lo ingresa en la terminal.
         3. El sistema consulta y retorna el nombre del titular, cantidad de acompañantes y un
            indicador visual (Verde = Incluido; Rojo = Requiere Cobro).
         4. El Staff permite o detiene el acceso.




HOTELES                                                                                Diseño de software
Modelo de Casos de Uso del Sistema                                                                 27


7.6.     Especificación de Casos de Uso (Módulo Administración)
7.6.1.    CU-09: Gestionar Catálogo de Habitaciones
    Actor Principal: Administrador (CRUD)
Descripción: Mantenimiento de la oferta física del hotel, permitiendo habilitar, modificar o dar de
baja infraestructura.
Precondiciones: Autenticación con rol de nivel gerencial.

       Flujo Principal:

         1. El Administrador accede al panel y selecciona una sucursal específica.
         2. Selecciona la opción "Modificar Habitación".
         3. El sistema despliega las características actuales.
         4. El Administrador actualiza los datos y el sistema guarda los cambios.

       Flujos Alternativos: 5a. Deshabilitar habitación: Si existen reservas futuras, emite una alerta
       bloqueante exigiendo reubicación previa.

7.6.2.    CU-10: Actualizar Tarifas
    Actor Principal: Administrador
Descripción: Configuración de los precios base y aplicación de precios dinámicos según tempora-
das.
Precondiciones: Autenticación con rol de nivel gerencial.

       Flujo Principal:

         1. El Administrador ingresa al módulo tarifario.
         2. Selecciona rango de fechas y categoría.
         3. Establece el nuevo valor por noche.
         4. El sistema valida que los valores sean mayores a cero.
         5. El sistema confirma y propaga la actualización tarifaria.

       Postcondiciones: Las reservas futuras reflejarán nuevos precios. Las reservas previas confir-
       madas mantienen precio original (inmutabilidad).

7.6.3.    CU-11: Configurar Sucursales
   Actor Principal: Administrador
Descripción: Permite la escalabilidad geográfica agregando nuevos establecimientos.
Precondiciones: Autenticación con rol Super-Administrador.

       Flujo Principal:



HOTELES                                                                            Diseño de software
Modelo de Casos de Uso del Sistema                                                              28


         1. El Administrador selecciona "Nueva Sucursal".
         2. Ingresa datos maestros (Nombre, Dirección, Región Tributaria).
         3. Define los módulos habilitados para esa sucursal.
         4. El sistema inicializa un inventario vacío en base de datos.

7.6.4.    CU-12: Visualizar Panel Eventos
    Actor Principal: Administrador
Descripción: Proporciona un dashboard de monitoreo para auditar la logística de las Suites Ejecu-
tivas.
Precondiciones: Autenticación con rol gerencial.

      Flujo Principal:

         1. El Administrador accede al panel de eventos.
         2. El sistema compila las reservas futuras con la extensión Añadir Evento Privado.
         3. El sistema muestra un listado detallando Fecha, Sucursal, Titular, Asistentes y Valida-
            ción de Edad.
         4. El Administrador utiliza la información para coordinar stock y turnos.




HOTELES                                                                         Diseño de software
Diagramas de Secuencia                                                                           29


8.       Diagramas de Secuencia
    Los diagramas de secuencia presentados a continuación detallan la orquestación y el intercam-
bio de mensajes entre los distintos componentes del sistema (controladores, servicios, bases de
datos y actores externos) a lo largo del eje temporal. Cada diagrama modela la lógica transaccional
de los Casos de Uso previamente definidos.


8.1.     CU-01: Realizar Reserva




                      Figura 8.1: Diagrama de Secuencia: Realizar Reserva

    Justificación Técnica: El flujo demuestra un alto nivel de cohesión al orquestar múltiples do-
minios. Se separa claramente la responsabilidad de búsqueda en el InventarioService (asegurando
el principio SRP) de la lógica transaccional en el ReservaService. Las validaciones opcionales («ex-
tend») se manejan como bloques condicionales lógicos (opt y alt), evitando procesar el pago si se
viola la regla de negocio de mayoría de edad.



HOTELES                                                                          Diseño de software
Diagramas de Secuencia                                                                            30


8.2.     CU-02: Cancelar Reserva




                      Figura 8.2: Diagrama de Secuencia: Cancelar Reserva

    Justificación Técnica: Destaca el manejo del estado transaccional. La arquitectura evalúa di-
námicamente el tiempo transcurrido para decidir entre dos flujos financieros críticos: el cobro de la
multa o la liberación de la garantía. Además, demuestra la comunicación inter-servicios al llamar
al InventarioService para asegurar que la habitación vuelva a estar disponible inmediatamente tras
la cancelación, previniendo pérdidas de ingresos.




HOTELES                                                                           Diseño de software
Diagramas de Secuencia                                                                           31


8.3.     CU-03: Realizar Check-in




                      Figura 8.3: Diagrama de Secuencia: Realizar Check-in

    Documentación y Justificación Técnica: Este diagrama documenta la llegada del huésped y
evidencia la orquestación de servicios en el backend. El CheckInController delega la validación
de la reserva al ReservaService. Al confirmarse el Çamino Feliz", se observa la ejecución del caso
de uso incluido (Registrar Acompañantes) interactuando con la base de datos. Crucialmente, se
invoca al FolioService para instanciar la entidad "Folio.en estado .ACTIVO", la cual es un requisito
indispensable (precondición) para todos los procesos operativos futuros (como cobrar consumos o
daños).




HOTELES                                                                          Diseño de software
Diagramas de Secuencia                                                                           32


8.4.     CU-04: Procesar Check-out




                     Figura 8.4: Diagrama de Secuencia: Procesar Check-out

    Documentación y Justificación Técnica: Este es uno de los diagramas más ricos, ya que con-
solida el trabajo de otros módulos e ilustra un flujo transaccional de alta complejidad. Destaca la
representación lógica de las extensiones («extend») mediante los fragmentos alt y opt de UML: la
penalización automatizada por Late Check-out y el recálculo tributario por Exención de IVA. Tras
la consolidación del folio, el backend asume un rol de cliente HTTP para asegurar el pago con la
Pasarela (garantizando PCI-DSS) y posteriormente con el SII para el timbraje electrónico (DTE),
cerrando el ciclo de vida del huésped y cambiando el estado de la habitación para notificar al Staff
de Limpieza.



HOTELES                                                                          Diseño de software
Diagramas de Secuencia                                                                              33


8.5.     CU-05: Registrar Daños




                       Figura 8.5: Diagrama de Secuencia: Registrar Daños

    Justificación Técnica: Este diagrama es fundamental para evidenciar la trazabilidad entre mó-
dulos. Se demuestra cómo una acción iniciada en la capa operativa móvil (Limpieza) impacta di-
rectamente en la capa financiera (Front-Desk) mediante la invocación del FolioService. Al cambiar
el estado de la habitación a .En Reparación", se garantiza la integridad de los datos, evitando que sea
asignada en un futuro Check-in antes de ser arreglada.




HOTELES                                                                             Diseño de software
Diagramas de Secuencia                                                                           34


8.6.     CU-06: Vender Alcohol




                       Figura 8.6: Diagrama de Secuencia: Vender Alcohol

     Justificación Técnica: Refleja la implementación de la Regla de Negocio (Venta de Alcohol)
con una arquitectura defensiva. El sistema utiliza el código de estado HTTP 428 para interrumpir
el flujo y forzar al Staff a realizar la verificación de identidad. Además, muestra cómo se resuelve
la decisión de pago, derivando la deuda al FolioService si el huésped decide cargar el monto a su
estadía, manteniendo la centralización contable requerida.




HOTELES                                                                          Diseño de software
Diagramas de Secuencia                                                                           35


8.7.     CU-07: Cobrar Desayuno Local




                   Figura 8.7: Diagrama de Secuencia: Cobrar Desayuno Local

    Documentación y Justificación Técnica: Este flujo demuestra la comunicación entre dominios
(Cafetería y Front-Desk) para reutilizar lógica de negocio. El diseño respeta el Principio Abierto/-
Cerrado (OCP); la lógica de validación del beneficio se consulta directamente al ReservaService
sin que el CafeteriaService necesite conocer la estructura interna de las reservas. Los flujos al-
ternativos de pago (Contado vs. Cargo a Habitación) resuelven la transacción antes de unirse en
un paso común final: la actualización del inventario en base de datos, garantizando consistencia
independientemente de la modalidad comercial.




HOTELES                                                                          Diseño de software
Diagramas de Secuencia                                                                          36


8.8.     CU-08: Generar Comanda Room Service




                 Figura 8.8: Diagrama de Secuencia: Generar Comanda Room
                 Service

    Justificación Técnica: Evidencia el manejo seguro de estados transaccionales. Antes de com-
prometer los recursos de cocina o realizar el cargo al folio, el sistema valida la existencia de un
Folio Activo. El patrón de diseño inyecta el FolioService dentro del flujo del Room Service, lo que
centraliza la responsabilidad financiera (SRP) y asegura que ningún pedido sea despachado a una
habitación que ya realizó Check-out.




HOTELES                                                                         Diseño de software
Diagramas de Secuencia                                                                          37


8.9.     CU-09: Gestionar Catálogo de Habitaciones




                 Figura 8.9: Diagrama de Secuencia: Gestionar Catálogo de Ha-
                 bitaciones

    Justificación Técnica: Muestra un diseño robusto de validación de invariantes de negocio.
Modificar el estado físico de una habitación tiene un efecto cascada, por lo que el CatalogoService
se apoya en el InventarioService para detectar cruces con reservas futuras. Esto previene un error
crítico de overbooking por reducción de oferta. El detalle final de ïnvalidar caché"demuestra un
pensamiento orientado a sistemas de alto rendimiento y escalabilidad.




HOTELES                                                                         Diseño de software
Diagramas de Secuencia                                                                             38


8.10.      CU-10: Actualizar Tarifas




                      Figura 8.10: Diagrama de Secuencia: Actualizar Tarifas

    Justificación Técnica: El diagrama clarifica una regla arquitectónica crucial: la inmutabilidad
de los contratos comerciales. El flujo muestra que la actualización de precios solo inserta nuevas re-
glas que serán consumidas por búsquedas futuras, sin ejecutar operaciones de actualización masiva
(UPDATE) sobre las reservas confirmadas en el pasado. Se aplica el principio de Responsabilidad
Única delegando la comprobación de límites numéricos al PoliticasValidator.




HOTELES                                                                            Diseño de software
Diagramas de Secuencia                                                                            39


8.11.      CU-11: Configurar Sucursales




                   Figura 8.11: Diagrama de Secuencia: Configurar Sucursales

    Documentación y Justificación Técnica: Este flujo demuestra cómo el sistema maneja la es-
calabilidad horizontal del negocio. Ilustra el patrón de diseño Saga o de orquestación local: crear
una sucursal no es solo guardar un registro; requiere preparar el sistema para operar. El Sucursal-
Service delega al InventarioService la responsabilidad de crear las tablas o registros en blanco para
las futuras habitaciones, respetando la alta cohesión.




HOTELES                                                                           Diseño de software
Diagramas de Secuencia                                                                           40


8.12.     CU-12: Visualizar Panel Eventos




                  Figura 8.12: Diagrama de Secuencia: Visualizar Panel Eventos

    Justificación Técnica: Para operaciones de solo lectura intensivas (Dashboards), la arquitectura
asume una consulta directa optimizada. Destaca el paso interno de mapearADtoSeguro, asegurando
que el Dashboard solo reciba los datos necesarios para la logística operativa (fechas, asistentes)
sin exponer datos sensibles financieros de la reserva, cumpliendo con principios de seguridad y
privacidad.




HOTELES                                                                          Diseño de software
Diagramas de Secuencia                                                                         41


8.13.     CU-13: Buscar Disponibilidad




                  Figura 8.13: Diagrama de Secuencia: Buscar Disponibilidad

   Justificación Técnica: Destaca por manejar elegantemente la excepción de negocio del over-
booking. En lugar de devolver un error 404 técnico, el sistema ejecuta un camino alternativo co-
mercialmente útil: buscar fechas sugeridas. Además, evidencia el bajo acoplamiento al inyectar el
TarifasService para que calcule el precio dinámico en tiempo real basado en las reglas del CU-10,
garantizando que el usuario siempre vea la tarifa vigente.




HOTELES                                                                        Diseño de software
Diagramas de Secuencia                                                                        42


8.14.     CU-14: Consultar Estado de Cuenta / Folio




                Figura 8.14: Diagrama de Secuencia: Consultar Estado de Cuen-
                ta

   Justificación Técnica: Valida la promesa arquitectónica del sistema centralizado. El diagrama
muestra que el FolioService actúa como el único punto de verdad, consolidando cargos que fue-
ron inyectados asíncronamente por otros actores (Cafetería, Limpieza). El sub-flujo opcional de
generación de PDF demuestra el soporte a requerimientos no funcionales (NFR) de usabilidad y
reportería.




HOTELES                                                                       Diseño de software
Diagramas de Secuencia                                                                           43


8.15.     CU-15: Consultar Desayuno (Auditoría Rápida)




                    Figura 8.15: Diagrama de Secuencia: Consultar Desayuno

    Justificación Técnica: Ilustra una transacción de micro-latencia diseñada puramente para la
eficiencia operativa del personal. Al no generar transacciones de escritura (solo consultas GET), el
sistema evita bloquear la base de datos, garantizando tiempos de respuesta ultrarrápidos (<2 segun-
dos), cumpliendo directamente con los Atributos de Calidad (NFR) de rendimiento que definieron
al principio del proyecto.




HOTELES                                                                          Diseño de software
Diagrama de Clases                                                                               44


9.       Diagrama de Clases
    El Diagrama de Clases es el pilar estructural del sistema orientado a objetos. A continuación,
se presenta el modelo de dominio completo, seguido de un análisis detallado de sus subsistemas
principales y los patrones de diseño aplicados para garantizar alta cohesión y bajo acoplamiento.




                  Figura 9.1: Diagrama de Clases General del Sistema Hotelero


9.1.     Núcleo del Sistema (Core Hotelero)
    Este módulo representa la infraestructura física. La clase Hotel actúa como el agregador princi-
pal, vinculando la ubicación geográfica con los recursos operativos.




                          Figura 9.2: Subsistema: Núcleo y Habitaciones

       Jerarquía de Habitaciones: Se utiliza herencia para especializar el comportamiento. Mien-
       tras que una HabitacionEstandar es básica, la HabitacionEjecutiva introduce una depen-



HOTELES                                                                          Diseño de software
Diagrama de Clases                                                                             45


       dencia con el inventario (productos/licores), lo que demuestra un acoplamiento funcional
       específico para servicios VIP.
       Gestión de Estados: Mediante el enumerador EstadoHabitacion, el sistema asegura que una
       habitación no pueda ser asignada a una reserva si su estado es SUCIA o MANTENIMIENTO,
       gatillando así el flujo automático hacia el módulo de Operaciones.


9.2.     Recursos Humanos: El Patrón Strategy
   Una de las decisiones de diseño más robustas del diagrama es cómo se manejan los roles del
personal, evitando la rigidez estructural.
       Composición sobre Herencia: En lugar de instanciar un .EmpleadoRecepcionistaçomo una
       clase estática, se utiliza la interfaz IRolEmpleado. Esto permite que un Empleado sea un
       objeto dinámico: hoy puede tener asignado el RolRecepcionista y mañana, tras un ascenso,
       cambiar a RolAdministrador, simplemente reemplazando la instancia de la interfaz en tiempo
       de ejecución.
       Desacoplamiento: La entidad Empleado ignora la lógica de cálculo de su nivel de acceso o
       permisos; simplemente delega esa responsabilidad a su IRolEmpleado asignado.


9.3.     Finanzas y Cobros: Extensibilidad Total
  En este módulo se aplica un diseño orientado a plugins (abierto a la extensión, cerrado a la
modificación) mediante la interfaz ICobrable.




                       Figura 9.3: Subsistema: Finanzas, Cuentas y Cobros

       Polimorfismo en la Cuenta: La clase Cuenta no necesita conocer los atributos específicos
       de un "Servicio de Desayuno.o una "Penalización por Daño". Su única interacción se realiza
       a través del contrato polimórfico de la interfaz ICobrable.



HOTELES                                                                        Diseño de software
Diagrama de Clases                                                                                46


       Interacción Clave: Al invocar el método calcularTotal() en la Cuenta, esta itera sobre su
       lista de objetos ICobrable, sumando los subtotales de forma agnóstica. Esto permite que en
       el futuro se añadan nuevos tipos de cobros (ej. "Tour Guiado.o "Spa") sin necesidad de alterar
       ni una sola línea de código interno en la clase Cuenta.


9.4.     Operaciones e Inventario: Trazabilidad
   Este módulo asegura la auditoría y cierra el ciclo de vida del mantenimiento del hotel.
       Órdenes de Servicio: La relación entre Empleado y OrdenServicio es de ejecución. La es-
       pecialización mediante las clases OrdenLimpieza y OrdenMantenimiento permite aislar la
       lógica sobre qué tipo de insumos o herramientas requiere cada tarea.
       Control de Stock: La entidad Cafeteria gestiona un arreglo de Producto. Cada interacción
       (venta o reposición) genera una entidad MovimientoStock, asegurando una auditoría perfecta
       sobre los insumos consumidos tanto por los clientes como por la propia operativa interna.


9.5.     Capas Transversales (Seguridad y Notificaciones)
    Estas capas actúan como envolturas (wrappers) arquitectónicas, brindando soporte funcional e
integracional al resto de los dominios.




                            Figura 9.4: Subsistema: Capas Transversales

       Seguridad Unificada: Tanto Cliente como Empleado poseen una relación de cardinalidad
       opcional (0..1) con Usuario. Esto habilita un sistema de autenticación (login) unificado, don-
       de la interfaz gráfica y los privilegios (qué módulos renderiza el frontend) dependen de la
       naturaleza de la entidad asociada a esas credenciales.
       Inyección del Notificador: La entidad Reserva depende exclusivamente de la abstracción
       INotificador. Al depender de una interfaz y no de una implementación concreta, el sistema
       central es completamente agnóstico al canal de comunicación. Es posible implementar un
       NotificadorWhatsApp o un NotificadorEmail sin que la lógica interna de la reserva requiera
       modificación alguna.




HOTELES                                                                           Diseño de software
Diagramas de Actividad (Flujos de Proceso de Negocio)                                          47


10.        Diagramas de Actividad (Flujos de Pro-
           ceso de Negocio)
    Nota Arquitectónica: Mientras que los diagramas de secuencia (sección anterior) detallan
exhaustivamente la interacción técnica de todos los casos de uso, en esta sección se presentan los
Diagramas de Actividad exclusivamente para los procesos transaccionales de mayor complejidad y
criticidad para el negocio, modelando la orquestación de actores, sistemas y validaciones legales.


10.1.     Diagrama de Actividad: CU-01 Realizar Reserva
    Este diagrama modela el árbol de decisiones completo desde que el cliente busca disponibili-
dad hasta que se emite la confirmación, incluyendo las validaciones de políticas y la integración
financiera.




HOTELES                                                                        Diseño de software
Diagramas de Actividad (Flujos de Proceso de Negocio)                                      48




                    Figura 10.1: Diagrama de Actividad: Realizar Reserva

   Justificación Técnica (CU-01): La notación UML utilizada emplea un nodo Fork/Join (barras



HOTELES                                                                    Diseño de software
Diagramas de Actividad (Flujos de Proceso de Negocio)                                          49


negras paralelas en el diseño) después de la validación del pago. Esto demuestra una optimiza-
ción arquitectónica de Nivel 5: el sistema paraleliza la escritura en base de datos y el bloqueo
de inventario para reducir el tiempo de respuesta al cliente, cumpliendo con los Requerimientos
No Funcionales (NFR) de rendimiento. Los Swimlanes (carriles) aíslan claramente el dominio de
responsabilidad de la Pasarela externa.


10.2.     Diagrama de Actividad: CU-04 Procesar Check-out
  Este flujo es vital porque representa el cierre del ciclo de vida del huésped, consolidando los
módulos de Operaciones y Front-Desk en un solo evento financiero y tributario.




                    Figura 10.2: Diagrama de Actividad: Procesar Check-out




HOTELES                                                                        Diseño de software
Diagramas de Actividad (Flujos de Proceso de Negocio)                                          50


    Justificación Técnica (CU-04): Este diagrama expone la lógica algorítmica profunda del sis-
tema mediante el uso de bucles repeat / repeat while. En el mundo real, los pagos fallan a menudo;
modelar un bucle que permite al recepcionista reintentar el cobro sin perder la consolidación del
folio demuestra una comprensión excepcional de la experiencia de usuario (UX) y la tolerancia
a fallos. Además, los caminos de decisión secuenciales (Late Check-out seguido de Exención de
IVA) validan que el sistema aplica las reglas de negocio en el orden algebraico correcto antes de
procesar el pago.


10.3.     Diagrama de Actividad: CU-05 Registrar Daños y Multas
   Este proceso es excelente para modelar en actividad porque muestra cómo el trabajo de un actor
operativo (Limpieza) detona procesos contables automáticos en el Core del sistema.




                 Figura 10.3: Diagrama de Actividad: Registrar Daños y Multas

    Justificación Técnica (CU-05): Este diagrama demuestra el control de concurrencia y la au-
tomatización de procesos (workflow). El uso del nodo de sincronización cuádruple (fork) ilustra
cómo el sistema optimiza el tiempo de respuesta: mientras actualiza el estado contable del folio,
bloquea la habitación para evitar reasignaciones (overbooking) y notifica al personal de recepción
de forma simultánea.


10.4.     Diagrama de Actividad: CU-06 Vender Alcohol (Restric-
          ción de Edad)
    Este es quizás uno de los flujos de negocio más interesantes porque modela una interrupción
obligatoria por normativas legales (Regla de Negocio) y una bifurcación en el método de pago.




HOTELES                                                                        Diseño de software
Diagramas de Actividad (Flujos de Proceso de Negocio)                                     51




HOTELES                                                                   Diseño de software
                     Figura 10.4: Diagrama de Actividad: Vender Alcohol
Diagramas de Actividad (Flujos de Proceso de Negocio)                                          52


    Justificación Técnica (CU-06): El diagrama modela perfectamente la implementación de una
restricción dura del negocio. Se visualiza claramente cómo el sistema interviene preventivamente
antes de procesar cualquier aspecto financiero, obligando al usuario físico (Staff) a realizar una
acción externa (pedir el carnet). Además, la resolución de la forma de pago mediante una decisión
lógica consolida la versatilidad operativa del software.




HOTELES                                                                        Diseño de software

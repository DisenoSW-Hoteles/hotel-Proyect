CREATE OR REPLACE VIEW v_disponibilidad AS
SELECT h.id AS habitacion_id, h.numero, h.sucursal_id, s.nombre AS sucursal, h.tipo, h.estado, h.capacidad_maxima, h.capacidad_base, rt.id AS tarifa_id, rt.precio_noche_base, rt.cargo_persona_extra, rt.nombre_regla AS estrategia_tarifa
FROM habitacion h
JOIN sucursal s ON s.id = h.sucursal_id
JOIN regla_tarifa rt ON rt.sucursal_id = h.sucursal_id AND rt.tipo_habitacion = h.tipo AND rt.activo = TRUE AND rt.vigencia_desde <= CURRENT_DATE AND (rt.vigencia_hasta IS NULL OR rt.vigencia_hasta >= CURRENT_DATE) AND rt.nombre_regla = 'RACK'
WHERE h.estado = 'DISPONIBLE';

CREATE OR REPLACE VIEW v_reservas_activas AS
SELECT r.id AS reserva_id, r.fecha_entrada, r.fecha_salida, r.estado AS estado_reserva, r.precio_total, r.num_huespedes, r.tiene_evento_privado, r.modalidad_desayuno, s.nombre AS sucursal, h.numero AS habitacion, h.tipo AS tipo_habitacion, c.nombres || ' ' || c.apellidos AS cliente_nombre, c.email AS cliente_email, c.tipo_documento, c.documento_num, c.nacionalidad, f.id AS folio_id, f.estado AS estado_folio, f.total_consolidado AS total_folio
FROM reserva r
JOIN habitacion h ON h.id = r.habitacion_id
JOIN sucursal s ON s.id = r.sucursal_id
JOIN cliente c ON c.id = r.cliente_id
LEFT JOIN folio f ON f.reserva_id = r.id
WHERE r.estado NOT IN ('CANCELADA', 'NO_SHOW');

CREATE OR REPLACE VIEW v_panel_eventos AS
SELECT r.id AS reserva_id, r.fecha_entrada, s.nombre AS sucursal, h.numero AS habitacion, c.nombres || ' ' || c.apellidos AS titular, ep.num_asistentes, ep.incluye_alcohol, ep.bebidas_seleccionadas, r.acepta_terminos_legales, ep.recargo_evento
FROM reserva r
JOIN habitacion h ON h.id = r.habitacion_id
JOIN sucursal s ON s.id = r.sucursal_id
JOIN cliente c ON c.id = r.cliente_id
JOIN evento_privado ep ON ep.reserva_id = r.id
WHERE r.fecha_entrada > CURRENT_DATE AND r.estado NOT IN ('CANCELADA', 'NO_SHOW')
ORDER BY r.fecha_entrada;

CREATE OR REPLACE VIEW v_estado_folio AS
SELECT f.id AS folio_id, f.estado AS estado_folio, f.total_consolidado, f.porcentaje_iva, f.cargo_late_checkout, r.id AS reserva_id, h.numero AS habitacion, s.nombre AS sucursal, c.nombres || ' ' || c.apellidos AS titular, json_agg(json_build_object('tipo', cf.tipo_cargo, 'descripcion', cf.descripcion, 'monto', cf.monto, 'generado_en', cf.generado_en) ORDER BY cf.generado_en) AS cargos
FROM folio f
JOIN reserva r ON r.id = f.reserva_id
JOIN habitacion h ON h.id = r.habitacion_id
JOIN sucursal s ON s.id = r.sucursal_id
JOIN cliente c ON c.id = r.cliente_id
LEFT JOIN cargo_folio cf ON cf.folio_id = f.id
WHERE f.estado = 'ACTIVO'
GROUP BY f.id, r.id, h.numero, s.nombre, c.nombres, c.apellidos;
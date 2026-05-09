INSERT INTO sucursal (nombre, direccion, ciudad, region_tributaria) VALUES
('TEMUCO', 'Av. Alemania 123', 'Temuco', 'Región de La Araucanía'),
('PUCON', 'O Higgins 456', 'Pucón', 'Región de La Araucanía'),
('SANTIAGO', 'Av. Providencia 789', 'Santiago', 'Región Metropolitana'),
('VINA_DEL_MAR', 'Av. San Martín 321', 'Viña del Mar', 'Región de Valparaíso');

INSERT INTO habitacion (sucursal_id, numero, piso, tipo, capacidad_maxima, capacidad_base) VALUES
(1,'101',1,'ESTANDAR',2,2), (1,'102',1,'ESTANDAR',2,2), (1,'201',2,'PLUS',4,2), (1,'202',2,'PLUS',4,2), (1,'301',3,'SUITE_EJECUTIVA',8,2),
(2,'101',1,'ESTANDAR',2,2), (2,'201',2,'PLUS',4,2), (2,'301',3,'SUITE_EJECUTIVA',8,2),
(3,'101',1,'ESTANDAR',2,2), (3,'201',2,'PLUS',4,2), (3,'301',3,'SUITE_EJECUTIVA',8,2),
(4,'101',1,'ESTANDAR',2,2), (4,'201',2,'PLUS',4,2), (4,'301',3,'SUITE_EJECUTIVA',8,2);

INSERT INTO regla_tarifa (sucursal_id, tipo_habitacion, nombre_regla, precio_noche_base, cargo_persona_extra, vigencia_desde) VALUES
(1,'ESTANDAR', 'RACK',50000, 0, '2025-01-01'), (1,'PLUS', 'RACK',80000, 15000,'2025-01-01'), (1,'SUITE_EJECUTIVA','RACK',150000,20000,'2025-01-01'),
(2,'ESTANDAR', 'RACK',55000, 0, '2025-01-01'), (2,'PLUS', 'RACK',90000, 15000,'2025-01-01'), (2,'SUITE_EJECUTIVA','RACK',180000,20000,'2025-01-01'),
(3,'ESTANDAR', 'RACK',70000, 0, '2025-01-01'), (3,'PLUS', 'RACK',100000,18000,'2025-01-01'), (3,'SUITE_EJECUTIVA','RACK',200000,25000,'2025-01-01'),
(4,'ESTANDAR', 'RACK',65000, 0, '2025-01-01'), (4,'PLUS', 'RACK',95000, 16000,'2025-01-01'), (4,'SUITE_EJECUTIVA','RACK',190000,22000,'2025-01-01');
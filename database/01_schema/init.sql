CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TIPOS ENUMERADOS
CREATE TYPE sucursal_enum AS ENUM ('TEMUCO', 'PUCON', 'SANTIAGO', 'VINA_DEL_MAR');
CREATE TYPE tipo_habitacion AS ENUM ('ESTANDAR', 'PLUS', 'SUITE_EJECUTIVA');
CREATE TYPE estado_habitacion AS ENUM ('DISPONIBLE', 'OCUPADA', 'SUCIA', 'EN_REPARACION', 'BLOQUEADA');
CREATE TYPE estado_reserva AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW');
CREATE TYPE estado_folio AS ENUM ('ACTIVO', 'PAGADO', 'PENDIENTE_PAGO');
CREATE TYPE modalidad_desayuno AS ENUM ('EN_HABITACION', 'EN_CAFETERIA', 'NO_INCLUIDO');
CREATE TYPE estado_verificacion AS ENUM ('APROBADO', 'RECHAZADO');
CREATE TYPE tipo_documento AS ENUM ('RUT', 'PASAPORTE');
CREATE TYPE metodo_pago AS ENUM ('EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'CARGO_HABITACION', 'PENDIENTE');

-- TABLAS
CREATE TABLE sucursal (
    id SERIAL PRIMARY KEY,
    nombre sucursal_enum NOT NULL UNIQUE,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    region_tributaria VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE habitacion (
    id SERIAL PRIMARY KEY,
    sucursal_id INT NOT NULL REFERENCES sucursal(id) ON DELETE RESTRICT,
    numero VARCHAR(10) NOT NULL,
    piso SMALLINT NOT NULL CHECK (piso >= 0),
    tipo tipo_habitacion NOT NULL,
    estado estado_habitacion NOT NULL DEFAULT 'DISPONIBLE',
    capacidad_maxima SMALLINT NOT NULL CHECK (capacidad_maxima BETWEEN 1 AND 8),
    capacidad_base SMALLINT NOT NULL DEFAULT 2 CHECK (capacidad_base >= 1),
    descripcion TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_habitacion_sucursal UNIQUE (sucursal_id, numero),
    CONSTRAINT ck_cap_base_menor_max CHECK (capacidad_base <= capacidad_maxima)
);

CREATE TABLE regla_tarifa (
    id SERIAL PRIMARY KEY,
    sucursal_id INT NOT NULL REFERENCES sucursal(id) ON DELETE RESTRICT,
    tipo_habitacion tipo_habitacion NOT NULL,
    nombre_regla VARCHAR(80) NOT NULL,
    precio_noche_base NUMERIC(12,2) NOT NULL CHECK (precio_noche_base > 0),
    cargo_persona_extra NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cargo_persona_extra >= 0),
    vigencia_desde DATE NOT NULL,
    vigencia_hasta DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_vigencia_tarifa CHECK (vigencia_hasta IS NULL OR vigencia_hasta > vigencia_desde),
    CONSTRAINT uq_regla_vigencia UNIQUE (sucursal_id, tipo_habitacion, nombre_regla, vigencia_desde)
);

CREATE TABLE cliente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    tipo_documento tipo_documento NOT NULL,
    documento_num VARCHAR(50) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    nacionalidad VARCHAR(60) NOT NULL,
    usuario_id UUID,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reserva (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES cliente(id) ON DELETE RESTRICT,
    habitacion_id INT NOT NULL REFERENCES habitacion(id) ON DELETE RESTRICT,
    sucursal_id INT NOT NULL REFERENCES sucursal(id) ON DELETE RESTRICT,
    regla_tarifa_id INT NOT NULL REFERENCES regla_tarifa(id) ON DELETE RESTRICT,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    num_huespedes SMALLINT NOT NULL DEFAULT 1 CHECK (num_huespedes >= 1),
    estado estado_reserva NOT NULL DEFAULT 'PENDIENTE',
    modalidad_desayuno modalidad_desayuno NOT NULL DEFAULT 'NO_INCLUIDO',
    desayuno_bonificado BOOLEAN NOT NULL DEFAULT FALSE,
    tiene_evento_privado BOOLEAN NOT NULL DEFAULT FALSE,
    acepta_terminos_legales BOOLEAN NOT NULL DEFAULT FALSE,
    terminos_aceptados_en TIMESTAMPTZ,
    subtotal_habitacion NUMERIC(12,2) NOT NULL CHECK (subtotal_habitacion >= 0),
    cargo_personas_extra NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cargo_personas_extra >= 0),
    cargo_evento NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cargo_evento >= 0),
    descuento_aplicado NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (descuento_aplicado >= 0),
    tipo_descuento VARCHAR(30),
    exento_iva BOOLEAN NOT NULL DEFAULT FALSE,
    precio_total NUMERIC(12,2) NOT NULL CHECK (precio_total >= 0),
    token_garantia VARCHAR(200),
    metodo_pago metodo_pago NOT NULL DEFAULT 'PENDIENTE',
    notas TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_fechas_reserva CHECK (fecha_salida > fecha_entrada),
    CONSTRAINT ck_num_huespedes_pos CHECK (num_huespedes > 0),
    CONSTRAINT ck_terminos_evento CHECK (tiene_evento_privado = FALSE OR acepta_terminos_legales = TRUE),
    CONSTRAINT ck_garantia_confirmada CHECK (estado != 'CONFIRMADA' OR token_garantia IS NOT NULL)
);

CREATE TABLE acompanante (
    id SERIAL PRIMARY KEY,
    reserva_id UUID NOT NULL REFERENCES reserva(id) ON DELETE CASCADE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    tipo_documento tipo_documento NOT NULL,
    documento_num VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE evento_privado (
    id SERIAL PRIMARY KEY,
    reserva_id UUID NOT NULL UNIQUE REFERENCES reserva(id) ON DELETE CASCADE,
    nombre_evento VARCHAR(150),
    num_asistentes SMALLINT NOT NULL CHECK (num_asistentes BETWEEN 1 AND 25),
    incluye_alcohol BOOLEAN NOT NULL DEFAULT FALSE,
    bebidas_seleccionadas JSONB,
    recargo_evento NUMERIC(12,2) NOT NULL CHECK (recargo_evento >= 0),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_asistentes_max CHECK (num_asistentes <= 25)
);

CREATE TABLE folio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID NOT NULL UNIQUE REFERENCES reserva(id) ON DELETE RESTRICT,
    estado estado_folio NOT NULL DEFAULT 'ACTIVO',
    cargo_late_checkout NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cargo_late_checkout >= 0),
    porcentaje_iva NUMERIC(5,2) NOT NULL DEFAULT 19.00,
    total_consolidado NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (total_consolidado >= 0),
    dte_codigo VARCHAR(100),
    dte_url TEXT,
    cerrado_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cargo_folio (
    id BIGSERIAL PRIMARY KEY,
    folio_id UUID NOT NULL REFERENCES folio(id) ON DELETE RESTRICT,
    tipo_cargo VARCHAR(30) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
    modulo_origen VARCHAR(50) NOT NULL,
    generado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_tipo_cargo CHECK (tipo_cargo IN ('HABITACION','CAFETERIA','ROOM_SERVICE','DANO','LATE_CHECKOUT','EVENTO','DESAYUNO'))
);

CREATE TABLE incidencia_dano (
    id SERIAL PRIMARY KEY,
    habitacion_id INT NOT NULL REFERENCES habitacion(id) ON DELETE RESTRICT,
    folio_id UUID REFERENCES folio(id) ON DELETE SET NULL,
    categoria_dano VARCHAR(80) NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia_url TEXT,
    costo_reposicion NUMERIC(12,2) NOT NULL CHECK (costo_reposicion >= 0),
    cargo_aplicado BOOLEAN NOT NULL DEFAULT FALSE,
    reportado_por VARCHAR(100),
    reportado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orden_servicio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_id UUID REFERENCES folio(id) ON DELETE SET NULL,
    habitacion_id INT REFERENCES habitacion(id) ON DELETE SET NULL,
    tipo_orden VARCHAR(30) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    metodo_pago metodo_pago NOT NULL DEFAULT 'CARGO_HABITACION',
    contiene_alcohol BOOLEAN NOT NULL DEFAULT FALSE,
    verificacion_edad estado_verificacion,
    fecha_nacimiento_verificada DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE_PREPARACION',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_tipo_orden CHECK (tipo_orden IN ('DESAYUNO_CAFETERIA', 'ROOM_SERVICE', 'CAFETERIA_DIRECTO')),
    CONSTRAINT ck_verificacion_alcohol CHECK (contiene_alcohol = FALSE OR verificacion_edad IS NOT NULL)
);

CREATE TABLE item_orden (
    id BIGSERIAL PRIMARY KEY,
    orden_id UUID NOT NULL REFERENCES orden_servicio(id) ON DELETE CASCADE,
    nombre_item VARCHAR(150) NOT NULL,
    cantidad SMALLINT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    es_alcoholico BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE auditoria_reserva (
    id BIGSERIAL PRIMARY KEY,
    reserva_id UUID NOT NULL REFERENCES reserva(id) ON DELETE CASCADE,
    estado_anterior estado_reserva,
    estado_nuevo estado_reserva NOT NULL,
    cambiado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cambiado_por VARCHAR(100)
);

-- ÍNDICES
CREATE INDEX idx_reserva_disponibilidad ON reserva (sucursal_id, habitacion_id, fecha_entrada, fecha_salida) WHERE estado NOT IN ('CANCELADA', 'NO_SHOW');
CREATE INDEX idx_reserva_cliente ON reserva (cliente_id, creado_en DESC);
CREATE INDEX idx_regla_tarifa_vigente ON regla_tarifa (sucursal_id, tipo_habitacion, vigencia_desde) WHERE activo = TRUE;
CREATE INDEX idx_cliente_documento ON cliente (documento_num);
CREATE INDEX idx_cliente_email ON cliente (email);
CREATE INDEX idx_cargo_folio ON cargo_folio (folio_id, generado_en DESC);
CREATE INDEX idx_reserva_eventos ON reserva (sucursal_id, fecha_entrada) WHERE tiene_evento_privado = TRUE AND estado NOT IN ('CANCELADA', 'NO_SHOW');
CREATE INDEX idx_dano_sin_cargo ON incidencia_dano (habitacion_id, reportado_en) WHERE cargo_aplicado = FALSE;
CREATE INDEX idx_habitacion_sucursal_tipo ON habitacion (sucursal_id, tipo, estado);

-- TRIGGERS Y FUNCIONES
CREATE OR REPLACE FUNCTION fn_actualizar_timestamp() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.actualizado_en = NOW(); RETURN NEW; END; $$;
CREATE TRIGGER trg_cliente_ts BEFORE UPDATE ON cliente FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();
CREATE TRIGGER trg_habitacion_ts BEFORE UPDATE ON habitacion FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();
CREATE TRIGGER trg_reserva_ts BEFORE UPDATE ON reserva FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();
CREATE TRIGGER trg_folio_ts BEFORE UPDATE ON folio FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE OR REPLACE FUNCTION fn_validar_capacidad_tipo() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN
    IF NEW.tipo = 'ESTANDAR' AND NEW.capacidad_maxima > 2 THEN RAISE EXCEPTION 'RN-02'; END IF;
    IF NEW.tipo = 'PLUS' AND NEW.capacidad_maxima > 4 THEN RAISE EXCEPTION 'RN-03'; END IF;
    IF NEW.tipo = 'SUITE_EJECUTIVA' AND NEW.capacidad_maxima > 8 THEN RAISE EXCEPTION 'RN-04'; END IF;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_validar_capacidad BEFORE INSERT OR UPDATE ON habitacion FOR EACH ROW EXECUTE FUNCTION fn_validar_capacidad_tipo();

CREATE OR REPLACE FUNCTION fn_validar_evento_privado() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_tipo tipo_habitacion; v_fecha_entrada DATE;
BEGIN
    SELECT h.tipo, r.fecha_entrada INTO v_tipo, v_fecha_entrada FROM reserva r JOIN habitacion h ON h.id = r.habitacion_id WHERE r.id = NEW.reserva_id;
    IF v_tipo != 'SUITE_EJECUTIVA' THEN RAISE EXCEPTION 'RN-05'; END IF;
    IF (v_fecha_entrada::TIMESTAMP - NOW()) < INTERVAL '48 hours' THEN RAISE EXCEPTION 'RN-13'; END IF;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_validar_evento BEFORE INSERT ON evento_privado FOR EACH ROW EXECUTE FUNCTION fn_validar_evento_privado();

CREATE OR REPLACE FUNCTION fn_verificar_disponibilidad() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_conflicto INT; v_cap_maxima SMALLINT;
BEGIN
    IF NEW.estado IN ('CANCELADA', 'NO_SHOW') THEN RETURN NEW; END IF;
    SELECT COUNT(*) INTO v_conflicto FROM reserva WHERE habitacion_id = NEW.habitacion_id AND id != NEW.id AND estado NOT IN ('CANCELADA', 'NO_SHOW') AND fecha_entrada < NEW.fecha_salida AND fecha_salida > NEW.fecha_entrada FOR UPDATE;
    IF v_conflicto > 0 THEN RAISE EXCEPTION 'RN-14'; END IF;
    SELECT capacidad_maxima INTO v_cap_maxima FROM habitacion WHERE id = NEW.habitacion_id;
    IF NEW.num_huespedes > v_cap_maxima THEN RAISE EXCEPTION 'RN-02/03/04'; END IF;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_verificar_disponibilidad BEFORE INSERT OR UPDATE ON reserva FOR EACH ROW EXECUTE FUNCTION fn_verificar_disponibilidad();

CREATE OR REPLACE FUNCTION fn_auditoria_estado_reserva() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN INSERT INTO auditoria_reserva (reserva_id, estado_anterior, estado_nuevo, cambiado_por) VALUES (NEW.id, OLD.estado, NEW.estado, current_user); END IF;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_auditoria_reserva AFTER UPDATE ON reserva FOR EACH ROW EXECUTE FUNCTION fn_auditoria_estado_reserva();

CREATE OR REPLACE FUNCTION fn_sincronizar_estado_habitacion() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.estado IN ('CANCELADA', 'NO_SHOW') THEN UPDATE habitacion SET estado = 'DISPONIBLE' WHERE id = NEW.habitacion_id AND estado NOT IN ('EN_REPARACION', 'BLOQUEADA');
    ELSIF NEW.estado = 'COMPLETADA' THEN UPDATE habitacion SET estado = 'SUCIA' WHERE id = NEW.habitacion_id; END IF;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_sincronizar_habitacion AFTER UPDATE OF estado ON reserva FOR EACH ROW EXECUTE FUNCTION fn_sincronizar_estado_habitacion();

CREATE OR REPLACE FUNCTION fn_aplicar_cargo_dano() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_folio_id UUID;
BEGIN
    SELECT f.id INTO v_folio_id FROM folio f JOIN reserva r ON r.id = f.reserva_id WHERE r.habitacion_id = NEW.habitacion_id AND f.estado = 'ACTIVO' ORDER BY f.creado_en DESC LIMIT 1;
    IF v_folio_id IS NOT NULL THEN
        INSERT INTO cargo_folio (folio_id, tipo_cargo, descripcion, monto, modulo_origen) VALUES (v_folio_id, 'DANO', 'Daño patrimonial: ' || NEW.descripcion, NEW.costo_reposicion, 'MANTENIMIENTO');
        NEW.cargo_aplicado := TRUE; NEW.folio_id := v_folio_id;
    END IF;
    UPDATE habitacion SET estado = 'EN_REPARACION' WHERE id = NEW.habitacion_id;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_cargo_dano BEFORE INSERT ON incidencia_dano FOR EACH ROW EXECUTE FUNCTION fn_aplicar_cargo_dano();

CREATE OR REPLACE FUNCTION fn_validar_horario_desayuno() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_hora TIME := LOCALTIME;
BEGIN
    IF NEW.tipo_orden = 'DESAYUNO_CAFETERIA' AND (v_hora < '07:00:00' OR v_hora > '10:30:00') THEN RAISE EXCEPTION 'RN-15'; END IF;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_validar_horario_desayuno BEFORE INSERT ON orden_servicio FOR EACH ROW EXECUTE FUNCTION fn_validar_horario_desayuno();

CREATE OR REPLACE FUNCTION fn_actualizar_total_folio() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE folio SET total_consolidado = (SELECT COALESCE(SUM(monto), 0) FROM cargo_folio WHERE folio_id = NEW.folio_id), actualizado_en = NOW() WHERE id = NEW.folio_id;
    RETURN NEW;
END; $$;
CREATE TRIGGER trg_total_folio AFTER INSERT ON cargo_folio FOR EACH ROW EXECUTE FUNCTION fn_actualizar_total_folio();
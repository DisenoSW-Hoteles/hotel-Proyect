import { AppDataSource } from '../config/database';
import { IHabitacionRepository } from '../../domain/ports/IHabitacionRepository';
import { ConsultaDisponibilidadDTO, HabitacionCrudaDTO } from '../../domain/dtos/Habitacion.dto';

/** Fila cruda devuelta por las consultas SQL (antes de tipar/parsear). */
interface FilaSQL {
  id: number;
  numero: string;
  tipo: string;
  capacidad_maxima: number;
  piso: number;
  estado: string;
  sucursal: string;
  precio_base: string | null;
}

/** Columnas comunes seleccionadas en ambas consultas (precio desde regla_tarifa vigente). */
const SELECT_HABITACION = `
  h.id, h.numero, h.piso, h.tipo, h.estado,
  h.capacidad_maxima AS capacidad_maxima,
  s.nombre::text AS sucursal,
  rt.precio_noche_base AS precio_base
  FROM habitacion h
  JOIN sucursal s ON s.id = h.sucursal_id
  LEFT JOIN regla_tarifa rt
    ON rt.sucursal_id = h.sucursal_id
   AND rt.tipo_habitacion = h.tipo
   AND rt.activo = TRUE`;

/**
 * ADAPTADOR de persistencia (TypeORM/PostgreSQL) del puerto IHabitacionRepository.
 * Es el ÚNICO lugar que conoce SQL. Usa consultas parametrizadas y trae la tarifa
 * base desde `regla_tarifa` vigente.
 */
export class TypeOrmHabitacionRepository implements IHabitacionRepository {
  async buscarDisponibles(consulta: ConsultaDisponibilidadDTO): Promise<HabitacionCrudaDTO[]> {
    const { fechaCheckIn, fechaCheckOut, cantidadHuespedes, sucursalNombre } = consulta;

    const sql = `
      SELECT ${SELECT_HABITACION}
      WHERE s.nombre::text = $1
        AND h.capacidad_maxima >= $2
        AND h.id NOT IN (
          SELECT r.habitacion_id FROM reserva r
          WHERE r.estado NOT IN ('CANCELADA', 'NO_SHOW')
            AND r.fecha_entrada < $3 AND r.fecha_salida > $4
        )
      ORDER BY h.id`;

    const filas: FilaSQL[] = await AppDataSource.query(sql, [
      sucursalNombre.toUpperCase(),
      cantidadHuespedes,
      fechaCheckOut,
      fechaCheckIn,
    ]);
    return filas.map(this.toCruda);
  }

  async buscarTodas(): Promise<HabitacionCrudaDTO[]> {
    const sql = `SELECT ${SELECT_HABITACION} ORDER BY s.nombre, h.numero`;
    const filas: FilaSQL[] = await AppDataSource.query(sql);
    return filas.map(this.toCruda);
  }

  async buscarPorId(id: number): Promise<HabitacionCrudaDTO | null> {
    const sql = `SELECT ${SELECT_HABITACION} WHERE h.id = $1 LIMIT 1`;
    const filas: FilaSQL[] = await AppDataSource.query(sql, [id]);
    return filas.length ? this.toCruda(filas[0]) : null;
  }

  private toCruda(f: FilaSQL): HabitacionCrudaDTO {
    return {
      id: f.id,
      numero: f.numero,
      tipo: f.tipo,
      capacidadMaxima: f.capacidad_maxima,
      piso: f.piso,
      estado: f.estado,
      sucursalNombre: f.sucursal,
      precioBase: f.precio_base ? Number(f.precio_base) : 0,
    };
  }
}

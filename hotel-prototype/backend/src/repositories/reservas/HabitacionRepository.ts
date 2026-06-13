import { AppDataSource } from '../../config/database';
import { Habitacion } from '../../models/entities/Habitacion.entity';
import { ConsultaDisponibilidadDTO } from '../../models/dtos/Habitacion.dto';

const AMENITIES_POR_TIPO: Record<string, string[]> = {
  ESTANDAR: ['WiFi', 'TV', 'Baño privado', 'Aire acondicionado'],
  PLUS: ['WiFi', 'TV', 'Baño privado', 'Aire acondicionado', 'Frigobar', 'Bañera'],
  SUITE_EJECUTIVA: [
    'WiFi',
    'TV 4K',
    'Baño privado',
    'Aire acondicionado',
    'Frigobar',
    'Jacuzzi',
    'Sala de estar',
    'Cocina equipada',
  ],
};

function mapEstadoToStatus(estado: string): string {
  const map: Record<string, string> = {
    DISPONIBLE: 'AVAILABLE',
    OCUPADA: 'OCCUPIED',
    SUCIA: 'CLEANING',
    EN_REPARACION: 'MAINTENANCE',
    BLOQUEADA: 'MAINTENANCE',
  };
  return map[estado] ?? 'AVAILABLE';
}

export const HabitacionRepository = AppDataSource.getRepository(Habitacion).extend({
  async buscarDisponibles(consulta: ConsultaDisponibilidadDTO) {
    const { fechaCheckIn, fechaCheckOut, cantidadHuespedes, sucursalNombre } = consulta;

    const rows = (await AppDataSource.manager.query(
      `
      SELECT
        h.id,
        h.numero,
        h.piso,
        h.tipo,
        h.capacidad_maxima AS "capacidadMaxima",
        h.estado,
        s.nombre AS sucursal,
        COALESCE(rt.precio_noche_base, 0) AS precio_noche_base
      FROM habitacion h
      JOIN sucursal s ON s.id = h.sucursal_id
      LEFT JOIN LATERAL (
        SELECT precio_noche_base
        FROM regla_tarifa
        WHERE sucursal_id = h.sucursal_id
          AND tipo_habitacion = h.tipo
          AND activo = true
        ORDER BY vigencia_desde DESC
        LIMIT 1
      ) rt ON true
      WHERE s.nombre = $1
        AND h.capacidad_maxima >= $2
        AND h.id NOT IN (
          SELECT habitacion_id FROM reserva
          WHERE estado NOT IN ('CANCELADA', 'NO_SHOW')
            AND fecha_entrada < $4
            AND fecha_salida > $3
        )
      ORDER BY h.tipo, h.numero
    `,
      [sucursalNombre.toUpperCase(), cantidadHuespedes, fechaCheckIn, fechaCheckOut],
    )) as Array<{
      id: number;
      numero: string;
      piso: number;
      tipo: string;
      capacidadMaxima: number;
      estado: string;
      sucursal: string;
      precio_noche_base: string;
    }>;

    return rows.map((row) => ({
      id: row.id,
      numero: row.numero,
      piso: row.piso,
      tipo: row.tipo,
      capacidadMaxima: Number(row.capacidadMaxima),
      estado: row.estado,
      sucursal: row.sucursal,
      precioPorNoche: parseFloat(row.precio_noche_base),
    }));
  },

  async buscarTodas(branch?: string) {
    let query = `
      SELECT
        h.id::text           AS id,
        h.numero             AS number,
        h.piso               AS floor,
        h.tipo               AS type,
        h.capacidad_maxima   AS capacity,
        h.estado             AS status,
        s.nombre             AS branch,
        COALESCE(rt.precio_noche_base, 0) AS base_rate
      FROM habitacion h
      JOIN sucursal s ON s.id = h.sucursal_id
      LEFT JOIN LATERAL (
        SELECT precio_noche_base
        FROM regla_tarifa
        WHERE sucursal_id = h.sucursal_id
          AND tipo_habitacion = h.tipo
          AND activo = true
        ORDER BY vigencia_desde DESC
        LIMIT 1
      ) rt ON true
    `;

    const params: string[] = [];
    if (branch) {
      params.push(branch.toUpperCase());
      query += ` WHERE s.nombre = $1`;
    }

    query += ` ORDER BY s.nombre, h.piso, h.numero`;

    const rows = (await AppDataSource.manager.query(query, params)) as Array<{
      id: string;
      number: string;
      floor: string;
      type: string;
      capacity: string;
      status: string;
      branch: string;
      base_rate: string;
    }>;

    return rows.map((row) => ({
      id: row.id,
      number: row.number,
      floor: parseInt(row.floor, 10),
      type: row.type,
      capacity: parseInt(row.capacity, 10),
      status: mapEstadoToStatus(row.status),
      branch: row.branch,
      base_rate: parseFloat(row.base_rate),
      amenities: AMENITIES_POR_TIPO[row.type] ?? [],
    }));
  },
});

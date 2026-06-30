import { AppDataSource } from '../../config/database';
import { Habitacion } from '../../models/entities/Habitacion.entity';
import { ConsultaDisponibilidadDTO } from '../../models/dtos/Habitacion.dto';

export const HabitacionRepository = AppDataSource.getRepository(Habitacion).extend({

  async buscarDisponibles(consulta: ConsultaDisponibilidadDTO) {
    const { fechaCheckIn, fechaCheckOut, cantidadHuespedes, sucursalNombre } = consulta;

    return this.createQueryBuilder('h')
      .innerJoin('sucursal', 's', 's.id = h.sucursal_id')
      .where('s.nombre = :sucursalNombre', { sucursalNombre: sucursalNombre.toUpperCase() })
      .andWhere('h.capacidad_maxima >= :cantidadHuespedes', { cantidadHuespedes })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('r.habitacion_id')
          .from('reserva', 'r')
          .where('r.estado NOT IN (:...estados)', { estados: ['CANCELADA', 'NO_SHOW'] })
          .andWhere('r.fecha_entrada < :fechaCheckOut AND r.fecha_salida > :fechaCheckIn')
          .getQuery();
        return 'h.id NOT IN ' + subQuery;
      })
      .setParameter('fechaCheckIn', fechaCheckIn)
      .setParameter('fechaCheckOut', fechaCheckOut)
      .getMany();
  },
  async buscarTodas() {
  const repo = AppDataSource.getRepository(Habitacion);
  // Traemos todas las habitaciones
  return await repo.find();
}
});

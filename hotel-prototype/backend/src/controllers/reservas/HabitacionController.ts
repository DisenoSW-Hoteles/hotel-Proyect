import { Request, Response, NextFunction } from 'express';
import { HabitacionService } from '../../services/reservas/HabitacionService';
import { ConsultaDisponibilidadDTO } from '../../models/dtos/Habitacion.dto';

const habitacionService = new HabitacionService();

export class HabitacionController {
  /**
   * @swagger
   * /api/habitaciones/disponibilidad:
   *   post:
   *     summary: Busca habitaciones disponibles por fecha y sucursal
   *     tags: [Habitaciones]
   */
  async buscarDisponibilidad(req: Request, res: Response, next: NextFunction) {
    try {
      const consulta: ConsultaDisponibilidadDTO = req.body;
      const disponibles = await habitacionService.obtenerHabitacionesDisponibles(consulta);
      res.status(200).json({
        status: 'success',
        results: disponibles.length,
        data: disponibles,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/admin/rooms:
   *   get:
   *     summary: Obtiene el catálogo completo de habitaciones para administración
   *     tags: [Admin - Habitaciones]
   */
  async obtenerTodas(req: Request, res: Response, next: NextFunction) {
    try {
      const branch = req.query['branch'] as string | undefined;
      const habitaciones = await habitacionService.obtenerTodas(branch);
      res.status(200).json(habitaciones);
    } catch (error) {
      next(error);
    }
  }
}

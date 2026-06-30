import { Request, Response, NextFunction } from 'express';
import { HabitacionService } from '../../../application/reservas/HabitacionService';
import { ConsultaDisponibilidadDTO } from '../../../domain/dtos/Habitacion.dto';

/**
 * Controlador de Habitaciones (adaptador HTTP). Recibe el caso de uso por
 * inyección de dependencias; no instancia servicios ni repositorios.
 */
export class HabitacionController {
  constructor(private readonly habitacionService: HabitacionService) {}

  /**
   * @swagger
   * /api/habitaciones/disponibilidad:
   *   post:
   *     summary: Busca habitaciones disponibles por fecha y sucursal
   *     tags: [Habitaciones]
   *     responses:
   *       200: { description: Lista de habitaciones disponibles }
   *       400: { description: Error de reglas de negocio }
   */
  buscarDisponibilidad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const consulta: ConsultaDisponibilidadDTO = req.body;
      const disponibles = await this.habitacionService.obtenerHabitacionesDisponibles(consulta);

      res.status(200).json({
        status: 'success',
        results: disponibles.length,
        data: disponibles,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/admin/rooms:
   *   get:
   *     summary: Obtiene el catálogo completo de habitaciones
   *     tags: [Habitaciones]
   *     responses:
   *       200: { description: Lista completa de habitaciones }
   */
  obtenerTodas = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitaciones = await this.habitacionService.obtenerTodas();
      res.status(200).json(habitaciones);
    } catch (error) {
      next(error);
    }
  };
}

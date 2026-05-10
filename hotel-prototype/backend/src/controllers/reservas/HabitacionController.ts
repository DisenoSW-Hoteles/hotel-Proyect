import { Request, Response, NextFunction } from 'express';
import { HabitacionService } from '../../services/reservas/HabitacionService';
import { ConsultaDisponibilidadDTO } from '../../models/dtos/Habitacion.dto.js';

const habitacionService = new HabitacionService();

export class HabitacionController {

/**
   * @swagger
   * /api/habitaciones/disponibilidad:
   *   post:
   *     summary: Busca habitaciones disponibles por fecha y sucursal
   *     tags: [Habitaciones]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fechaCheckIn:
   *                 type: string
   *                 example: "2026-06-10"
   *               fechaCheckOut:
   *                 type: string
   *                 example: "2026-06-15"
   *               cantidadHuespedes:
   *                 type: integer
   *                 example: 2
   *               sucursalNombre:
   *                 type: string
   *                 example: "Temuco"
   *     responses:
   *       200:
   *         description: Lista de habitaciones disponibles
   *       400:
   *         description: Error de reglas de negocio
   */
  async buscarDisponibilidad(req: Request, res: Response, next: NextFunction) {
    try {
      const consulta: ConsultaDisponibilidadDTO = req.body;

      const disponibles = await habitacionService.obtenerHabitacionesDisponibles(consulta);

      res.status(200).json({
        status: 'success',
        results: disponibles.length,
        data: disponibles
      });
    } catch (error) {
      next(error); // Delegamos el error al manejador global
    }
  }
}

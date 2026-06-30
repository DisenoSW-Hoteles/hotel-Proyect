import { Request, Response, NextFunction } from 'express';
import { CrearReservaService } from '../../../application/reservas/CrearReservaService';
import { CrearReservaDTO } from '../../../domain/dtos/ReservaPublica.dto';

/**
 * Controlador de creación de reservas del portal público (adaptador HTTP).
 */
export class ReservaPublicaController {
  constructor(private readonly crearReservaService: CrearReservaService) {}

  /**
   * @swagger
   * /api/reservas:
   *   post:
   *     summary: Crea una reserva desde el portal de clientes
   *     tags: [Reservas]
   *     responses:
   *       201: { description: Reserva creada con el total estimado }
   *       400: { description: Datos inválidos o capacidad excedida }
   *       404: { description: Habitación no encontrada }
   */
  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CrearReservaDTO;
      const reserva = await this.crearReservaService.crear(dto);
      res.status(201).json(reserva);
    } catch (error) {
      next(error);
    }
  };
}

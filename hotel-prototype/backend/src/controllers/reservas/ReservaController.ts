import { Request, Response, NextFunction } from 'express';
import { IReservaService } from '../../interfaces/IReservaService';
import { CrearReservaRequestDTO } from '../../models/dtos/Reserva.dto';
import { AppError } from '../../utils/errors/AppError';

export class ReservaController {
  constructor(private readonly reservaService: IReservaService) {}

  async crearReserva(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CrearReservaRequestDTO = req.body;
      const result = await this.reservaService.crearReserva(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorDocumento(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { documento } = req.params;
      const result = await this.reservaService.buscarPorDocumento(documento);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.reservaService.buscarPorId(id);
      if (!result) {
        return next(new AppError('No se encontró la reserva.', 404));
      }
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

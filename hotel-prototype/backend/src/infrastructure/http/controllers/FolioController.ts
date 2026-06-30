import { Request, Response, NextFunction } from 'express';
import { FolioService } from '../../../application/checkout/FolioService';
import { AddChargeRequestDTO, FolioRecord } from '../../../domain/dtos/Folio.dto';

/** Mapea el folio de dominio al DTO HTTP (snake_case) del panel-admin. */
const toResponse = (f: FolioRecord) => ({
  id: f.id,
  reservation_id: f.reservationId,
  guest: {
    id: f.guest.id,
    first_name: f.guest.firstName,
    last_name: f.guest.lastName,
    document_number: f.guest.documentNumber,
  },
  room: f.room,
  check_in_date: f.checkInDate,
  check_out_date: f.checkOutDate,
  charges: f.charges.map((c) => ({
    id: c.id,
    category: c.category,
    description: c.description,
    amount: c.amount,
    quantity: c.quantity,
    date: c.date,
    added_by: c.addedBy,
  })),
  status: f.status,
});

/**
 * Controlador de Folios (adaptador HTTP) para el flujo de check-out.
 */
export class FolioController {
  constructor(private readonly folioService: FolioService) {}

  obtenerPorReserva = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const folio = await this.folioService.obtenerPorReserva(req.params.reservationId);
      res.status(200).json(toResponse(folio));
    } catch (error) {
      next(error);
    }
  };

  agregarCargo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as AddChargeRequestDTO;
      const result = await this.folioService.agregarCargo(dto);
      res.status(201).json({ charge: result });
    } catch (error) {
      next(error);
    }
  };

  cerrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.folioService.cerrar(req.params.folioId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

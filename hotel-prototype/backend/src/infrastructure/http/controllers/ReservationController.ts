import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../../../application/reservas/ReservationService';
import { CheckInRequestDTO, ReservationRecord } from '../../../domain/dtos/Reservation.dto';

/** Mapea el modelo de dominio al DTO HTTP (snake_case) que espera el panel-admin. */
const toResponse = (r: ReservationRecord) => ({
  id: r.id,
  confirmation_code: r.confirmationCode,
  guest: {
    id: r.guest.id,
    first_name: r.guest.firstName,
    last_name: r.guest.lastName,
    document_number: r.guest.documentNumber,
    document_type: r.guest.documentType,
    nationality: r.guest.nationality,
    email: r.guest.email,
    phone: r.guest.phone,
  },
  room: r.room,
  check_in_date: r.checkInDate,
  check_out_date: r.checkOutDate,
  declared_companions: r.declaredCompanions,
  registered_companions: r.registeredCompanions.map((c) => ({
    id: c.id,
    first_name: c.firstName,
    last_name: c.lastName,
    document_number: c.documentNumber,
    document_type: c.documentType,
    registered_at: c.registeredAt,
  })),
  status: r.status,
  special_requests: r.specialRequests,
  branch: r.branch,
});

/**
 * Controlador de Reservas (adaptador HTTP) para el flujo de check-in.
 */
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  buscarPorCodigo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reserva = await this.reservationService.buscarPorCodigo(req.params.code);
      res.status(200).json(toResponse(reserva));
    } catch (error) {
      next(error);
    }
  };

  buscarPorDocumento = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reservas = await this.reservationService.buscarPorDocumento(req.params.documentNumber);
      res.status(200).json(reservas.map(toResponse));
    } catch (error) {
      next(error);
    }
  };

  checkIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CheckInRequestDTO;
      // El id de la URL es la fuente de verdad.
      dto.reservation_id = req.params.id;
      const actualizada = await this.reservationService.checkIn(dto);
      res.status(200).json(toResponse(actualizada));
    } catch (error) {
      next(error);
    }
  };
}

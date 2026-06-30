import { v4 as uuid } from 'uuid';
import { IReservationRepository } from '../../domain/ports/IReservationRepository';
import { AppError } from '../../domain/errors/AppError';
import {
  CheckInRequestDTO,
  CompanionRecord,
  ReservationRecord,
} from '../../domain/dtos/Reservation.dto';

/**
 * CASO DE USO de gestión de reservas para el check-in (capa de aplicación).
 * Depende del puerto `IReservationRepository`; sin acoplamiento a la persistencia.
 */
export class ReservationService {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async buscarPorCodigo(confirmationCode: string): Promise<ReservationRecord> {
    const reserva = await this.reservationRepository.findByCode(confirmationCode.trim());
    if (!reserva) {
      throw new AppError(`No se encontró la reserva con código ${confirmationCode}.`, 404);
    }
    return reserva;
  }

  async buscarPorDocumento(documentNumber: string): Promise<ReservationRecord[]> {
    return this.reservationRepository.findByGuestDocument(documentNumber.trim());
  }

  /**
   * Ejecuta el check-in: registra acompañantes y cambia el estado a CHECKED_IN.
   * Reglas: la reserva debe existir y estar CONFIRMED (no se puede hacer check-in
   * de una reserva cancelada, con no-show o ya finalizada).
   */
  async checkIn(dto: CheckInRequestDTO): Promise<ReservationRecord> {
    const reserva = await this.reservationRepository.findById(dto.reservation_id);
    if (!reserva) {
      throw new AppError('Reserva no encontrada.', 404);
    }
    if (reserva.status === 'CHECKED_IN') {
      throw new AppError('La reserva ya tiene un check-in registrado.', 409);
    }
    if (reserva.status !== 'CONFIRMED') {
      throw new AppError(
        `No se puede hacer check-in de una reserva en estado ${reserva.status}.`,
        400
      );
    }

    const ahora = dto.actual_check_in_time || new Date().toISOString();
    const companions: CompanionRecord[] = (dto.companions ?? []).map((c) => ({
      id: c.id ?? uuid(),
      firstName: c.first_name,
      lastName: c.last_name,
      documentNumber: c.document_number,
      documentType: c.document_type,
      registeredAt: c.registered_at ?? ahora,
    }));

    const actualizada: ReservationRecord = {
      ...reserva,
      status: 'CHECKED_IN',
      registeredCompanions: companions,
    };

    return this.reservationRepository.update(actualizada);
  }
}

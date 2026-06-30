import { ReservationRecord } from '../dtos/Reservation.dto';

/**
 * PUERTO de salida para el acceso a datos de reservas.
 * La implementación concreta (in-memory para el MVP, TypeORM en producción)
 * vive en infraestructura.
 */
export interface IReservationRepository {
  findByCode(confirmationCode: string): Promise<ReservationRecord | null>;
  findByGuestDocument(documentNumber: string): Promise<ReservationRecord[]>;
  findById(id: string): Promise<ReservationRecord | null>;
  update(reservation: ReservationRecord): Promise<ReservationRecord>;
}

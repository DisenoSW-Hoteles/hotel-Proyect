/** Contratos del dominio de Folios / Check-out. */
import { RoomRef } from './Reservation.dto';

export type FolioStatus = 'OPEN' | 'PENDING_REVIEW' | 'CLOSED';

/** Cargo individual de un folio (habitación, minibar, daños, etc.). */
export interface ChargeRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  quantity: number;
  date: string;
  addedBy: string;
}

/** Folio (cuenta consolidada) de una reserva. */
export interface FolioRecord {
  id: string;
  reservationId: string;
  guest: { id: string; firstName: string; lastName: string; documentNumber: string };
  room: RoomRef;
  checkInDate: string;
  checkOutDate?: string;
  charges: ChargeRecord[];
  status: FolioStatus;
}

// --- DTOs HTTP (snake_case, contrato con el panel-admin) ---

export interface AddChargeRequestDTO {
  folio_id: string;
  category: string;
  description: string;
  amount: number;
  quantity: number;
}

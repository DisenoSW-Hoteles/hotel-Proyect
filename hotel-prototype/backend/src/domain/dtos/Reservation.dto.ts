/** Contratos del dominio de Reservas / Check-in. */

export type ReservationStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW';

export type DocumentType = 'RUT' | 'PASSPORT';

/** Huésped titular de la reserva. */
export interface GuestRecord {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: DocumentType;
  nationality: string;
  email: string;
  phone: string;
}

/** Acompañante registrado en el check-in. */
export interface CompanionRecord {
  id?: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: DocumentType;
  registeredAt?: string;
}

export interface RoomRef {
  id: string;
  number: string;
  type: string;
}

/** Registro interno de una reserva (modelo de dominio). */
export interface ReservationRecord {
  id: string;
  confirmationCode: string;
  guest: GuestRecord;
  room: RoomRef;
  checkInDate: string;
  checkOutDate: string;
  declaredCompanions: number;
  registeredCompanions: CompanionRecord[];
  status: ReservationStatus;
  specialRequests: string;
  branch: string;
}

// --- DTOs HTTP (snake_case, contrato con el panel-admin) ---

export interface CompanionDTO {
  id?: string;
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: DocumentType;
  registered_at?: string;
}

export interface CheckInRequestDTO {
  reservation_id: string;
  companions: CompanionDTO[];
  actual_check_in_time: string;
  staff_id: string;
}

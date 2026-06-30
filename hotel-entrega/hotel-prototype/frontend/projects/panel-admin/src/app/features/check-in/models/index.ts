import { HotelBranch } from '../../../core/models';

// --- Domain ---

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: 'RUT' | 'PASSPORT';
  nationality: string;
  email?: string;
  phone?: string;
}

export interface Companion {
  id?: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: 'RUT' | 'PASSPORT';
  registeredAt?: Date;
}

export type ReservationStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Reservation {
  id: string;
  confirmationCode: string;
  guest: Guest;
  room: { id: string; number: string; type: string };
  checkInDate: Date;
  checkOutDate: Date;
  declaredCompanions: number;
  registeredCompanions: Companion[];
  status: ReservationStatus;
  specialRequests?: string;
  branch: HotelBranch;
}

// --- DTOs (contratos del endpoint admin) ---

export interface CompanionDto {
  id?: string;
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: 'RUT' | 'PASSPORT';
  registered_at?: string;
}

export interface ReservationResponseDto {
  id: string;
  confirmation_code: string;
  guest: {
    id: string;
    first_name: string;
    last_name: string;
    document_number: string;
    document_type: string;
    nationality: string;
    email: string;
    phone: string;
  };
  room: { id: string; number: string; type: string };
  check_in_date: string;
  check_out_date: string;
  declared_companions: number;
  registered_companions: CompanionDto[];
  status: string;
  special_requests: string;
  branch: string;
}

export interface CheckInRequestDto {
  reservation_id: string;
  companions: CompanionDto[];
  actual_check_in_time: string;
  staff_id: string;
}

// --- Mappers ---

export const mapCompanionDtoToDomain = (dto: CompanionDto): Companion => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  documentNumber: dto.document_number,
  documentType: dto.document_type,
  registeredAt: dto.registered_at ? new Date(dto.registered_at) : undefined,
});

export const mapReservationDtoToDomain = (dto: ReservationResponseDto): Reservation => ({
  id: dto.id,
  confirmationCode: dto.confirmation_code,
  guest: {
    id: dto.guest.id,
    firstName: dto.guest.first_name,
    lastName: dto.guest.last_name,
    documentNumber: dto.guest.document_number,
    documentType: dto.guest.document_type as 'RUT' | 'PASSPORT',
    nationality: dto.guest.nationality,
    email: dto.guest.email,
    phone: dto.guest.phone,
  },
  room: dto.room,
  checkInDate: new Date(dto.check_in_date),
  checkOutDate: new Date(dto.check_out_date),
  declaredCompanions: dto.declared_companions,
  registeredCompanions: dto.registered_companions.map(mapCompanionDtoToDomain),
  status: dto.status as ReservationStatus,
  specialRequests: dto.special_requests,
  branch: dto.branch as HotelBranch,
});

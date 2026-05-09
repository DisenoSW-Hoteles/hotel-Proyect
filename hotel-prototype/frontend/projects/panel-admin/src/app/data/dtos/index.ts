// =============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// Principio: Los DTOs actúan como "adaptadores" entre la forma en que la API
// expone los datos y los modelos de dominio del frontend. Esto desacopla el
// frontend de los contratos de la API — si el backend cambia el nombre de un
// campo, solo se actualiza el DTO y el mapper, no los componentes.
// =============================================================================

import { AuthUser, Companion, Folio, FolioCharge, Reservation, Room } from '../../core/models';

// --- Auth DTOs ---

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    branch: string;
  };
}

// --- Reservation DTOs ---

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
  room: RoomResponseDto;
  check_in_date: string; // ISO 8601
  check_out_date: string;
  declared_companions: number;
  registered_companions: CompanionDto[];
  status: string;
  special_requests: string;
  branch: string;
}

export interface CompanionDto {
  id?: string;
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: 'RUT' | 'PASSPORT';
  registered_at?: string;
}

export interface CheckInRequestDto {
  reservation_id: string;
  companions: CompanionDto[];
  actual_check_in_time: string; // ISO 8601
  staff_id: string;
}

export interface CheckOutRequestDto {
  reservation_id: string;
  folio_id: string;
  actual_check_out_time: string;
  payment_method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER';
  staff_id: string;
}

// --- Room DTOs ---

export interface RoomResponseDto {
  id: string;
  number: string;
  floor: number;
  type: string;
  capacity: number;
  base_rate: number;
  status: string;
  amenities: string[];
  branch: string;
}

export interface UpdateRoomRateDto {
  room_id: string;
  base_rate: number;
  effective_from: string; // ISO 8601 date
  reason?: string;
}

// --- Folio DTOs ---

export interface FolioResponseDto {
  id: string;
  reservation_id: string;
  guest: {
    id: string;
    first_name: string;
    last_name: string;
    document_number: string;
  };
  room: RoomResponseDto;
  check_in_date: string;
  check_out_date?: string;
  charges: ChargeDto[];
  status: string;
}

export interface ChargeDto {
  id: string;
  category: string;
  description: string;
  amount: number;
  quantity: number;
  date: string;
  added_by: string;
}

export interface AddChargeRequestDto {
  folio_id: string;
  category: string;
  description: string;
  amount: number;
  quantity: number;
}

// =============================================================================
// MAPPERS — Funciones puras que convierten DTOs → Modelos de dominio
// Principio SRP: Un mapper tiene una sola responsabilidad: transformar datos.
// Al ser funciones puras (sin efectos secundarios), son trivialmente testeables.
// =============================================================================

export const mapLoginResponseToUser = (dto: LoginResponseDto): AuthUser => ({
  id: dto.user.id,
  email: dto.user.email,
  name: dto.user.full_name,
  role: dto.user.role as AuthUser['role'],
  sucursal: dto.user.branch as AuthUser['sucursal'],
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
  room: mapRoomDtoToDomain(dto.room),
  checkInDate: new Date(dto.check_in_date),
  checkOutDate: new Date(dto.check_out_date),
  declaredCompanions: dto.declared_companions,
  registeredCompanions: dto.registered_companions.map(mapCompanionDtoToDomain),
  status: dto.status as Reservation['status'],
  specialRequests: dto.special_requests,
  branch: dto.branch as Reservation['branch'],
});

export const mapCompanionDtoToDomain = (dto: CompanionDto): Companion => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  documentNumber: dto.document_number,
  documentType: dto.document_type,
  registeredAt: dto.registered_at ? new Date(dto.registered_at) : undefined,
});

export const mapRoomDtoToDomain = (dto: RoomResponseDto): Room => ({
  id: dto.id,
  number: dto.number,
  floor: dto.floor,
  type: dto.type as Room['type'],
  capacity: dto.capacity,
  baseRate: dto.base_rate,
  status: dto.status as Room['status'],
  amenities: dto.amenities,
  branch: dto.branch as Room['branch'],
});

export const mapFolioDtoToDomain = (dto: FolioResponseDto): Folio => {
  const charges = dto.charges.map(mapChargeDtoToDomain);
  return {
    id: dto.id,
    reservationId: dto.reservation_id,
    guest: {
      id: dto.guest.id,
      firstName: dto.guest.first_name,
      lastName: dto.guest.last_name,
      documentNumber: dto.guest.document_number,
      documentType: 'RUT',
      nationality: '',
    },
    room: mapRoomDtoToDomain(dto.room),
    checkInDate: new Date(dto.check_in_date),
    checkOutDate: dto.check_out_date ? new Date(dto.check_out_date) : undefined,
    charges,
    status: dto.status as Folio['status'],
    totalAmount: charges.reduce((sum, c) => sum + c.amount * c.quantity, 0),
  };
};

export const mapChargeDtoToDomain = (dto: ChargeDto): FolioCharge => ({
  id: dto.id,
  category: dto.category as FolioCharge['category'],
  description: dto.description,
  amount: dto.amount,
  quantity: dto.quantity,
  date: new Date(dto.date),
  addedBy: dto.added_by,
});

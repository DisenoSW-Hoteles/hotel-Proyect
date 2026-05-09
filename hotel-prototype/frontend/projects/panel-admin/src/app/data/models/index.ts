import {
  AuthUser,
  Companion,
  ChargeCategory,
  Folio,
  FolioStatus,
  Guest,
  HotelBranch,
  Reservation,
  ReservationStatus,
  Room,
  RoomStatus,
  RoomType,
} from '../../core/models';

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    branch: string;
  };
}

export interface GuestDto {
  id: string;
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: 'RUT' | 'PASSPORT';
  nationality: string;
  email?: string;
  phone?: string;
}

export interface CompanionDto {
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: 'RUT' | 'PASSPORT';
}

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

export interface ReservationResponseDto {
  id: string;
  confirmation_code: string;
  guest: GuestDto;
  room: RoomResponseDto;
  check_in_date: string;
  check_out_date: string;
  declared_companions: number;
  registered_companions: CompanionDto[];
  status: string;
  special_requests?: string;
  branch: string;
}

export interface FolioChargeDto {
  id: string;
  category: string;
  description: string;
  amount: number;
  quantity: number;
  date: string;
  added_by: string;
}

export interface FolioResponseDto {
  id: string;
  reservation_id: string;
  guest: GuestDto;
  room: RoomResponseDto;
  check_in_date: string;
  check_out_date?: string;
  charges: FolioChargeDto[];
  status: string;
  total_amount: number;
}

export interface CheckInRequestDto {
  reservation_id: string;
  companions: CompanionDto[];
  actual_check_in_time: string;
  staff_id: string;
}

export interface AddChargeRequestDto {
  folio_id: string;
  category: ChargeCategory;
  description: string;
  amount: number;
  quantity: number;
}

export interface UpdateRoomRateRequestDto {
  room_id: string;
  base_rate: number;
  effective_from: string;
  reason: string;
}

export const mapLoginResponseToUser = (
  response: LoginResponseDto
): AuthUser => ({
  id: response.user.id,
  email: response.user.email,
  name: response.user.full_name,
  role: response.user.role as AuthUser['role'],
  sucursal: response.user.branch as HotelBranch,
});

export const mapGuestDtoToDomain = (dto: GuestDto): Guest => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  documentNumber: dto.document_number,
  documentType: dto.document_type,
  nationality: dto.nationality,
  email: dto.email,
  phone: dto.phone,
});

export const mapCompanionDtoToDomain = (dto: CompanionDto): Companion => ({
  firstName: dto.first_name,
  lastName: dto.last_name,
  documentNumber: dto.document_number,
  documentType: dto.document_type,
});

export const mapRoomDtoToDomain = (dto: RoomResponseDto): Room => ({
  id: dto.id,
  number: dto.number,
  floor: dto.floor,
  type: dto.type as RoomType,
  capacity: dto.capacity,
  baseRate: dto.base_rate,
  status: dto.status as RoomStatus,
  amenities: dto.amenities,
  branch: dto.branch as HotelBranch,
});

export const mapReservationDtoToDomain = (
  dto: ReservationResponseDto
): Reservation => ({
  id: dto.id,
  confirmationCode: dto.confirmation_code,
  guest: mapGuestDtoToDomain(dto.guest),
  room: mapRoomDtoToDomain(dto.room),
  checkInDate: new Date(dto.check_in_date),
  checkOutDate: new Date(dto.check_out_date),
  declaredCompanions: dto.declared_companions,
  registeredCompanions: dto.registered_companions.map(mapCompanionDtoToDomain),
  status: dto.status as ReservationStatus,
  specialRequests: dto.special_requests,
  branch: dto.branch as HotelBranch,
});

export const mapFolioChargeDtoToDomain = (
  dto: FolioChargeDto
): import('../../core/models').FolioCharge => ({
  id: dto.id,
  category: dto.category as ChargeCategory,
  description: dto.description,
  amount: dto.amount,
  quantity: dto.quantity,
  date: new Date(dto.date),
  addedBy: dto.added_by,
});

export const mapFolioDtoToDomain = (dto: FolioResponseDto): Folio => ({
  id: dto.id,
  reservationId: dto.reservation_id,
  guest: mapGuestDtoToDomain(dto.guest),
  room: mapRoomDtoToDomain(dto.room),
  checkInDate: new Date(dto.check_in_date),
  checkOutDate: dto.check_out_date ? new Date(dto.check_out_date) : undefined,
  charges: dto.charges.map(mapFolioChargeDtoToDomain),
  status: dto.status as FolioStatus,
  totalAmount: dto.total_amount,
});

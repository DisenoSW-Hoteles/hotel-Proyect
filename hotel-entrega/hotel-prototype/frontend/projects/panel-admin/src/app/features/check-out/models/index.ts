// --- Domain ---

export type ChargeCategory =
  | 'BASE_RATE'
  | 'LATE_CHECKOUT'
  | 'DAMAGE'
  | 'MINIBAR'
  | 'RESTAURANT'
  | 'LAUNDRY'
  | 'PARKING'
  | 'OTHER';

export type FolioStatus = 'OPEN' | 'PENDING_REVIEW' | 'CLOSED';

export interface FolioCharge {
  id: string;
  category: ChargeCategory;
  description: string;
  amount: number;
  quantity: number;
  date: Date;
  addedBy: string;
}

export interface Folio {
  id: string;
  reservationId: string;
  guest: { id: string; firstName: string; lastName: string; documentNumber: string };
  room: { id: string; number: string; type: string };
  checkInDate: Date;
  checkOutDate?: Date;
  charges: FolioCharge[];
  status: FolioStatus;
  totalAmount: number;
}

// --- DTOs (contratos del endpoint admin) ---

export interface ChargeDto {
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
  guest: { id: string; first_name: string; last_name: string; document_number: string };
  room: { id: string; number: string; type: string };
  check_in_date: string;
  check_out_date?: string;
  charges: ChargeDto[];
  status: string;
}

export interface AddChargeRequestDto {
  folio_id: string;
  category: string;
  description: string;
  amount: number;
  quantity: number;
}

// --- Mappers ---

export const mapChargeDtoToDomain = (dto: ChargeDto): FolioCharge => ({
  id: dto.id,
  category: dto.category as ChargeCategory,
  description: dto.description,
  amount: dto.amount,
  quantity: dto.quantity,
  date: new Date(dto.date),
  addedBy: dto.added_by,
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
    },
    room: dto.room,
    checkInDate: new Date(dto.check_in_date),
    checkOutDate: dto.check_out_date ? new Date(dto.check_out_date) : undefined,
    charges,
    status: dto.status as FolioStatus,
    totalAmount: charges.reduce((sum, c) => sum + c.amount * c.quantity, 0),
  };
};

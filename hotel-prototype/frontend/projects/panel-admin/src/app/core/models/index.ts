// =============================================================================
// CORE DOMAIN MODELS
// Estas interfaces son el "lenguaje ubicuo" del dominio.
// No dependen de ningún framework — son POJOS puros y testeables de forma aislada.
// =============================================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  sucursal: HotelBranch;
}

export type AdminRole = 'SUPER_ADMIN' | 'GERENTE' | 'RECEPCIONISTA';
export type HotelBranch = 'TEMUCO' | 'PUCON' | 'SANTIAGO' | 'VINA_DEL_MAR';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

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
  room: Room;
  checkInDate: Date;
  checkOutDate: Date;
  declaredCompanions: number;
  registeredCompanions: Companion[];
  status: ReservationStatus;
  specialRequests?: string;
  branch: HotelBranch;
}

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
export type RoomType = 'STANDARD' | 'SUPERIOR' | 'DELUXE' | 'SUITE' | 'PREMIUM_SUITE';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  baseRate: number;
  status: RoomStatus;
  amenities: string[];
  branch: HotelBranch;
}

export type ChargeCategory =
  | 'BASE_RATE'
  | 'LATE_CHECKOUT'
  | 'DAMAGE'
  | 'MINIBAR'
  | 'RESTAURANT'
  | 'LAUNDRY'
  | 'PARKING'
  | 'OTHER';

export interface FolioCharge {
  id: string;
  category: ChargeCategory;
  description: string;
  amount: number;
  quantity: number;
  date: Date;
  addedBy: string;
}

export type FolioStatus = 'OPEN' | 'PENDING_REVIEW' | 'CLOSED';

export interface Folio {
  id: string;
  reservationId: string;
  guest: Guest;
  room: Room;
  checkInDate: Date;
  checkOutDate?: Date;
  charges: FolioCharge[];
  status: FolioStatus;
  totalAmount: number;
}

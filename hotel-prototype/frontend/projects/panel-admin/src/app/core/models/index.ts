// =============================================================================
// CORE DOMAIN MODELS
// Principio: Estas interfaces son el "lenguaje ubicuo" del dominio.
// No dependen de ningún framework — son POJOS puros y testeables de forma aislada.
// Separar modelos de dominio de DTOs permite absorber cambios en la API
// sin afectar la lógica de negocio ni los componentes de presentación.
// =============================================================================

// --- Auth Domain ---

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

// --- Reservation & Guest Domain ---

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  /** RUT formato: 12345678-9 o número de pasaporte */
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
  /** Cantidad de acompañantes DECLARADA al hacer la reserva */
  declaredCompanions: number;
  /** Acompañantes efectivamente registrados en recepción */
  registeredCompanions: Companion[];
  status: ReservationStatus;
  specialRequests?: string;
  branch: HotelBranch;
}

// --- Room Domain ---

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
export type RoomType = 'STANDARD' | 'SUPERIOR' | 'DELUXE' | 'SUITE' | 'PREMIUM_SUITE';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  baseRate: number; // CLP por noche
  status: RoomStatus;
  amenities: string[];
  branch: HotelBranch;
}

// --- Folio (Cuenta del Huésped) Domain ---

export type ChargeCategory =
  | 'BASE_RATE'        // Tarifa base por noche
  | 'LATE_CHECKOUT'    // Recargo por salida tardía (posterior a 12:00)
  | 'DAMAGE'           // Multa por daños
  | 'MINIBAR'          // Consumo minibar
  | 'RESTAURANT'       // Consumo restaurante/cafetería
  | 'LAUNDRY'          // Servicio de lavandería
  | 'PARKING'          // Estacionamiento
  | 'OTHER';           // Otros cargos

export interface FolioCharge {
  id: string;
  category: ChargeCategory;
  description: string;
  amount: number; // CLP
  quantity: number;
  date: Date;
  addedBy: string; // userId del staff
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
  totalAmount: number; // calculado, no persistido directamente
}

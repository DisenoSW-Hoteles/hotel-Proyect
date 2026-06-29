export interface CrearReservaRequestDTO {
  habitacionId: number;
  sucursalNombre: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  tipoDocumento: 'RUT' | 'PASAPORTE';
  documentoNum: string;
}

export interface CrearReservaResponseDTO {
  id: string;
  confirmationCode: string;
  huespedNombre: string;
  documentoNum: string;
  habitacionId: number;
  sucursalNombre: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  precioTotal: number;
  estado: string;
}

export interface GuestDto {
  id: string;
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: string;
  nationality: string;
  email: string;
  phone: string;
}

export interface RoomDto {
  id: number;
  number: string;
  type: string;
}

export interface CompanionDto {
  id?: string;
  first_name: string;
  last_name: string;
  document_number: string;
  document_type: 'RUT' | 'PASAPORTE';
  registered_at?: string;
}

export interface AdminReservationResponseDto {
  id: string;
  confirmation_code: string;
  guest: GuestDto;
  room: RoomDto;
  check_in_date: string;
  check_out_date: string;
  declared_companions: number;
  registered_companions: CompanionDto[];
  status: string;
  special_requests: string;
  branch: string;
}

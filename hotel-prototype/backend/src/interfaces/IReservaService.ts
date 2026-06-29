import { CrearReservaRequestDTO, CrearReservaResponseDTO, AdminReservationResponseDto } from '../models/dtos/Reserva.dto';

export interface IReservaService {
  crearReserva(dto: CrearReservaRequestDTO): Promise<CrearReservaResponseDTO>;
  buscarPorDocumento(documento: string): Promise<AdminReservationResponseDto[]>;
  buscarPorId(id: string): Promise<AdminReservationResponseDto | null>;
}

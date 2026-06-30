import { v4 as uuid } from 'uuid';
import { IFolioRepository } from '../../domain/ports/IFolioRepository';
import { AppError } from '../../domain/errors/AppError';
import { AddChargeRequestDTO, ChargeRecord, FolioRecord } from '../../domain/dtos/Folio.dto';

/**
 * CASO DE USO del folio para el check-out (capa de aplicación).
 * Depende del puerto `IFolioRepository`.
 */
export class FolioService {
  constructor(private readonly folioRepository: IFolioRepository) {}

  async obtenerPorReserva(reservationId: string): Promise<FolioRecord> {
    const folio = await this.folioRepository.findByReservationId(reservationId);
    if (!folio) {
      throw new AppError('No se encontró el folio de la reserva.', 404);
    }
    return folio;
  }

  /**
   * Agrega un cargo al folio. Reglas: el folio debe existir y no estar cerrado;
   * el monto y la cantidad deben ser positivos.
   */
  async agregarCargo(dto: AddChargeRequestDTO): Promise<{ id: string }> {
    if (!dto.folio_id) {
      throw new AppError('folio_id es obligatorio.', 400);
    }
    if (dto.amount < 0 || dto.quantity <= 0) {
      throw new AppError('El monto debe ser >= 0 y la cantidad > 0.', 400);
    }

    const folio = await this.folioRepository.findById(dto.folio_id);
    if (!folio) {
      throw new AppError('Folio no encontrado.', 404);
    }
    if (folio.status === 'CLOSED') {
      throw new AppError('No se pueden agregar cargos a un folio cerrado.', 400);
    }

    const charge: ChargeRecord = {
      id: uuid(),
      category: dto.category,
      description: dto.description,
      amount: dto.amount,
      quantity: dto.quantity,
      date: new Date().toISOString(),
      addedBy: 'admin',
    };

    folio.charges.push(charge);
    await this.folioRepository.update(folio);
    return { id: charge.id };
  }

  /** Cierra el folio (queda en revisión previa al pago). */
  async cerrar(folioId: string): Promise<void> {
    const folio = await this.folioRepository.findById(folioId);
    if (!folio) {
      throw new AppError('Folio no encontrado.', 404);
    }
    folio.status = 'CLOSED';
    folio.checkOutDate = new Date().toISOString();
    await this.folioRepository.update(folio);
  }
}

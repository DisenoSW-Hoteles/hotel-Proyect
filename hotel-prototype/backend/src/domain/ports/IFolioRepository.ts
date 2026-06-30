import { FolioRecord } from '../dtos/Folio.dto';

/**
 * PUERTO de salida para el acceso a datos de folios.
 * Implementación concreta en infraestructura (in-memory / TypeORM).
 */
export interface IFolioRepository {
  findByReservationId(reservationId: string): Promise<FolioRecord | null>;
  findById(id: string): Promise<FolioRecord | null>;
  update(folio: FolioRecord): Promise<FolioRecord>;
}

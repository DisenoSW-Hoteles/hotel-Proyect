import { IFolioRepository } from '../../domain/ports/IFolioRepository';
import { FolioRecord } from '../../domain/dtos/Folio.dto';

/**
 * ADAPTADOR in-memory del puerto IFolioRepository, con folios de demo
 * consistentes con las reservas seedeadas (res-001, res-002).
 */
export class InMemoryFolioRepository implements IFolioRepository {
  private readonly folios: FolioRecord[] = [
    {
      id: 'fol-001',
      reservationId: 'res-001',
      guest: {
        id: 'cli-001',
        firstName: 'Juan',
        lastName: 'Pérez',
        documentNumber: '12.345.678-9',
      },
      room: { id: '1', number: '101', type: 'ESTANDAR' },
      checkInDate: '2026-07-01',
      charges: [
        {
          id: 'chg-001',
          category: 'BASE_RATE',
          description: 'Tarifa base habitación (3 noches)',
          amount: 50000,
          quantity: 3,
          date: '2026-07-01T15:00:00.000Z',
          addedBy: 'SYSTEM',
        },
      ],
      status: 'OPEN',
    },
    {
      id: 'fol-002',
      reservationId: 'res-002',
      guest: {
        id: 'cli-002',
        firstName: 'María',
        lastName: 'González',
        documentNumber: '9.876.543-2',
      },
      room: { id: '3', number: '201', type: 'PLUS' },
      checkInDate: '2026-07-02',
      charges: [
        {
          id: 'chg-002',
          category: 'BASE_RATE',
          description: 'Tarifa base habitación (4 noches)',
          amount: 80000,
          quantity: 4,
          date: '2026-07-02T15:00:00.000Z',
          addedBy: 'SYSTEM',
        },
      ],
      status: 'OPEN',
    },
  ];

  async findByReservationId(reservationId: string): Promise<FolioRecord | null> {
    return this.folios.find((f) => f.reservationId === reservationId) ?? null;
  }

  async findById(id: string): Promise<FolioRecord | null> {
    return this.folios.find((f) => f.id === id) ?? null;
  }

  async update(folio: FolioRecord): Promise<FolioRecord> {
    const idx = this.folios.findIndex((f) => f.id === folio.id);
    if (idx >= 0) {
      this.folios[idx] = folio;
    }
    return folio;
  }
}

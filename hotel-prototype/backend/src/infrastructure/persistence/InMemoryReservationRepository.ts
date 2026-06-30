import { IReservationRepository } from '../../domain/ports/IReservationRepository';
import { ReservationRecord } from '../../domain/dtos/Reservation.dto';

/**
 * ADAPTADOR in-memory del puerto IReservationRepository, con reservas de demo.
 * Permite que el check-in funcione end-to-end sin modelar/seedear toda la BD.
 * En producción se reemplaza por un adaptador TypeORM con el mismo contrato.
 */
export class InMemoryReservationRepository implements IReservationRepository {
  private readonly reservas: ReservationRecord[] = [
    {
      id: 'res-001',
      confirmationCode: 'ABC123',
      guest: {
        id: 'cli-001',
        firstName: 'Juan',
        lastName: 'Pérez',
        documentNumber: '12.345.678-9',
        documentType: 'RUT',
        nationality: 'Chilena',
        email: 'juan.perez@example.cl',
        phone: '+56912345678',
      },
      room: { id: '1', number: '101', type: 'ESTANDAR' },
      checkInDate: '2026-07-01',
      checkOutDate: '2026-07-04',
      declaredCompanions: 1,
      registeredCompanions: [],
      status: 'CONFIRMED',
      specialRequests: 'Habitación en piso alto.',
      branch: 'TEMUCO',
    },
    {
      id: 'res-002',
      confirmationCode: 'XYZ789',
      guest: {
        id: 'cli-002',
        firstName: 'María',
        lastName: 'González',
        documentNumber: '9.876.543-2',
        documentType: 'RUT',
        nationality: 'Chilena',
        email: 'maria.gonzalez@example.cl',
        phone: '+56987654321',
      },
      room: { id: '3', number: '201', type: 'PLUS' },
      checkInDate: '2026-07-02',
      checkOutDate: '2026-07-06',
      declaredCompanions: 0,
      registeredCompanions: [],
      status: 'CONFIRMED',
      specialRequests: '',
      branch: 'PUCON',
    },
  ];

  async findByCode(confirmationCode: string): Promise<ReservationRecord | null> {
    const code = confirmationCode.toUpperCase();
    return this.reservas.find((r) => r.confirmationCode.toUpperCase() === code) ?? null;
  }

  async findByGuestDocument(documentNumber: string): Promise<ReservationRecord[]> {
    const normaliza = (d: string) => d.replace(/[.\-\s]/g, '').toLowerCase();
    const objetivo = normaliza(documentNumber);
    return this.reservas.filter((r) => normaliza(r.guest.documentNumber) === objetivo);
  }

  async findById(id: string): Promise<ReservationRecord | null> {
    return this.reservas.find((r) => r.id === id) ?? null;
  }

  async update(reservation: ReservationRecord): Promise<ReservationRecord> {
    const idx = this.reservas.findIndex((r) => r.id === reservation.id);
    if (idx >= 0) {
      this.reservas[idx] = reservation;
    }
    return reservation;
  }
}

import { ReservationService } from '../../src/application/reservas/ReservationService';
import { InMemoryReservationRepository } from '../../src/infrastructure/persistence/InMemoryReservationRepository';
import { IReservationRepository } from '../../src/domain/ports/IReservationRepository';
import { ReservationRecord } from '../../src/domain/dtos/Reservation.dto';

const buildService = () => new ReservationService(new InMemoryReservationRepository());

describe('ReservationService', () => {
  describe('búsqueda', () => {
    it('encuentra una reserva por código (case-insensitive)', async () => {
      const reserva = await buildService().buscarPorCodigo('abc123');
      expect(reserva.confirmationCode).toBe('ABC123');
      expect(reserva.guest.lastName).toBe('Pérez');
    });

    it('lanza 404 si el código no existe', async () => {
      await expect(buildService().buscarPorCodigo('NOPE')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('encuentra reservas por documento del huésped (normaliza puntos/guiones)', async () => {
      const reservas = await buildService().buscarPorDocumento('12345678-9');
      expect(reservas).toHaveLength(1);
      expect(reservas[0].confirmationCode).toBe('ABC123');
    });

    it('retorna lista vacía si el documento no tiene reservas', async () => {
      expect(await buildService().buscarPorDocumento('00000000-0')).toEqual([]);
    });
  });

  describe('checkIn', () => {
    const dto = {
      reservation_id: 'res-001',
      companions: [
        {
          first_name: 'Ana',
          last_name: 'Pérez',
          document_number: '11.111.111-1',
          document_type: 'RUT' as const,
        },
      ],
      actual_check_in_time: '2026-07-01T15:30:00.000Z',
      staff_id: 'staff-1',
    };

    it('registra acompañantes y cambia el estado a CHECKED_IN', async () => {
      const service = buildService();
      const actualizada = await service.checkIn({ ...dto });

      expect(actualizada.status).toBe('CHECKED_IN');
      expect(actualizada.registeredCompanions).toHaveLength(1);
      expect(actualizada.registeredCompanions[0].id).toBeDefined();
      expect(actualizada.registeredCompanions[0].firstName).toBe('Ana');
    });

    it('lanza 404 si la reserva no existe', async () => {
      await expect(
        buildService().checkIn({ ...dto, reservation_id: 'inexistente' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('lanza 409 si la reserva ya tiene check-in', async () => {
      const service = buildService();
      await service.checkIn({ ...dto });
      await expect(service.checkIn({ ...dto })).rejects.toMatchObject({ statusCode: 409 });
    });

    it('lanza 400 si la reserva no está CONFIRMED', async () => {
      const canceladaRepo: IReservationRepository = {
        findById: async () =>
          ({
            id: 'x',
            status: 'CANCELLED',
            registeredCompanions: [],
          }) as unknown as ReservationRecord,
        findByCode: async () => null,
        findByGuestDocument: async () => [],
        update: async (r) => r,
      };
      const service = new ReservationService(canceladaRepo);
      await expect(service.checkIn({ ...dto, reservation_id: 'x' })).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });
});

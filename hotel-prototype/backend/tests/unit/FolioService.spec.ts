import { FolioService } from '../../src/application/checkout/FolioService';
import { InMemoryFolioRepository } from '../../src/infrastructure/persistence/InMemoryFolioRepository';

const buildService = () => new FolioService(new InMemoryFolioRepository());

const cargoValido = {
  folio_id: 'fol-001',
  category: 'MINIBAR',
  description: 'Agua mineral',
  amount: 2500,
  quantity: 2,
};

describe('FolioService', () => {
  describe('obtenerPorReserva', () => {
    it('devuelve el folio de una reserva', async () => {
      const folio = await buildService().obtenerPorReserva('res-001');
      expect(folio.id).toBe('fol-001');
      expect(folio.charges.length).toBeGreaterThan(0);
    });

    it('lanza 404 si la reserva no tiene folio', async () => {
      await expect(buildService().obtenerPorReserva('res-999')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('agregarCargo', () => {
    it('agrega un cargo y devuelve su id', async () => {
      const service = buildService();
      const { id } = await service.agregarCargo({ ...cargoValido });
      expect(id).toBeDefined();

      const folio = await service.obtenerPorReserva('res-001');
      expect(folio.charges.some((c) => c.id === id && c.description === 'Agua mineral')).toBe(true);
    });

    it('lanza 404 si el folio no existe', async () => {
      await expect(
        buildService().agregarCargo({ ...cargoValido, folio_id: 'fol-999' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('lanza 400 si el monto o la cantidad son inválidos', async () => {
      await expect(
        buildService().agregarCargo({ ...cargoValido, quantity: 0 })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('lanza 400 si el folio está cerrado', async () => {
      const service = buildService();
      await service.cerrar('fol-001');
      await expect(service.agregarCargo({ ...cargoValido })).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe('cerrar', () => {
    it('cierra el folio (status CLOSED + fecha de salida)', async () => {
      const service = buildService();
      await service.cerrar('fol-001');
      const folio = await service.obtenerPorReserva('res-001');
      expect(folio.status).toBe('CLOSED');
      expect(folio.checkOutDate).toBeDefined();
    });

    it('lanza 404 si el folio no existe', async () => {
      await expect(buildService().cerrar('fol-999')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

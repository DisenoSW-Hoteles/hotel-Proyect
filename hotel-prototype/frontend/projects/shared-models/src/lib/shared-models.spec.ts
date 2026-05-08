import { TipoHabitacion } from './enums/tipo-habitacion.enum';
import { Sucursal } from './enums/sucursal.enum';
import { TipoServicio } from './enums/tipo-servicio.enum';

describe('SharedModels', () => {
  it('TipoHabitacion enum should have expected values', () => {
    expect(TipoHabitacion.Estandar).toBe('Estandar');
    expect(TipoHabitacion.Plus).toBe('Plus');
    expect(TipoHabitacion.SuiteEjecutiva).toBe('SuiteEjecutiva');
  });

  it('Sucursal enum should have expected values', () => {
    expect(Sucursal.Temuco).toBe('Temuco');
    expect(Sucursal.Pucon).toBe('Pucon');
    expect(Sucursal.Santiago).toBe('Santiago');
    expect(Sucursal.VinaDelMar).toBe('VinaDelMar');
  });

  it('TipoServicio enum should have expected values', () => {
    expect(TipoServicio.DesayunoHabitacion).toBe('DesayunoHabitacion');
    expect(TipoServicio.DesayunoCafeteria).toBe('DesayunoCafeteria');
    expect(TipoServicio.EventoPrivado).toBe('EventoPrivado');
  });
});

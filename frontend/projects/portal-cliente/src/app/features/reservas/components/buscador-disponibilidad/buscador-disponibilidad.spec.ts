import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscadorDisponibilidad } from './buscador-disponibilidad';
import { DISPONIBILIDAD_SERVICE } from '../../services/disponibilidad.interface';
import { DisponibilidadMockService } from '../../services/disponibilidad-mock.service';
import { provideRouter } from '@angular/router';

describe('BuscadorDisponibilidad', () => {
  let component: BuscadorDisponibilidad;
  let fixture: ComponentFixture<BuscadorDisponibilidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorDisponibilidad],
      providers: [
        provideRouter([]),
        { provide: DISPONIBILIDAD_SERVICE, useClass: DisponibilidadMockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorDisponibilidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

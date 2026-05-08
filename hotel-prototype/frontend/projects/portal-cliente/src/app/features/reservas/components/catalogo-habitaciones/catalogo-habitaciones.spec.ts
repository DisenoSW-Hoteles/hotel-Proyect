import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoHabitaciones } from './catalogo-habitaciones';
import { HABITACIONES_SERVICE } from '../../services/habitaciones.interface';
import { HabitacionesMockService } from '../../services/habitaciones-mock.service';

describe('CatalogoHabitaciones', () => {
  let component: CatalogoHabitaciones;
  let fixture: ComponentFixture<CatalogoHabitaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoHabitaciones],
      providers: [
        { provide: HABITACIONES_SERVICE, useClass: HabitacionesMockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoHabitaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

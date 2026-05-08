import { Routes } from '@angular/router';
import { CatalogoHabitaciones } from './components/catalogo-habitaciones/catalogo-habitaciones';
import { BuscadorDisponibilidad } from './components/buscador-disponibilidad/buscador-disponibilidad';
import { FormularioReserva } from './components/formulario-reserva/formulario-reserva';

export default [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoHabitaciones },
  { path: 'buscar', component: BuscadorDisponibilidad },
  { path: 'confirmar', component: FormularioReserva },
] satisfies Routes;

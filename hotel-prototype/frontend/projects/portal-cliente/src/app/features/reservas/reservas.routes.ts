import { Routes } from '@angular/router';
import { BuscadorDisponibilidad } from './components/buscador-disponibilidad/buscador-disponibilidad';
import { FormularioReserva } from './components/formulario-reserva/formulario-reserva';

export default [
  { path: '', redirectTo: 'buscar', pathMatch: 'full' },
  { path: 'buscar', component: BuscadorDisponibilidad },
  { path: 'confirmar', component: FormularioReserva },
] satisfies Routes;

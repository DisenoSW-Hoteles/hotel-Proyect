import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitacionCatalogoDTO, TipoHabitacion } from 'shared-models';
import { IHabitacionesService, HABITACIONES_SERVICE } from '../../services/habitaciones.interface';

@Component({
  selector: 'app-catalogo-habitaciones',
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo-habitaciones.html',
  styleUrl: './catalogo-habitaciones.scss',
})
export class CatalogoHabitaciones {
  private readonly habitacionesService = inject<IHabitacionesService>(HABITACIONES_SERVICE);

  readonly catalogo = signal<HabitacionCatalogoDTO[]>([]);
  readonly loading = signal(true);

  readonly TipoHabitacion = TipoHabitacion;

  constructor() {
    this.habitacionesService.obtenerCatalogo().subscribe({
      next: (data) => {
        this.catalogo.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  porTipo(tipo: TipoHabitacion): HabitacionCatalogoDTO[] {
    return this.catalogo().filter(h => h.tipo === tipo);
  }
}

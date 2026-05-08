import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sucursal, ConsultaDisponibilidadDTO, HabitacionDisponibleDTO } from 'shared-models';
import { IDisponibilidadService, DISPONIBILIDAD_SERVICE } from '../../services/disponibilidad.interface';
import { ReservaEstadoService } from '../../services/reserva-estado.service';

@Component({
  selector: 'app-buscador-disponibilidad',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './buscador-disponibilidad.html',
  styleUrl: './buscador-disponibilidad.scss',
})
export class BuscadorDisponibilidad {
  private readonly fb = inject(FormBuilder);
  private readonly disponibilidadService = inject<IDisponibilidadService>(DISPONIBILIDAD_SERVICE);
  private readonly router = inject(Router);
  private readonly reservaEstado = inject(ReservaEstadoService);

  readonly sucursales = Object.values(Sucursal);
  readonly habitaciones = signal<HabitacionDisponibleDTO[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly buscado = signal(false);

  readonly form = this.fb.nonNullable.group({
    sucursalId: ['' as Sucursal, Validators.required],
    fechaCheckIn: ['', Validators.required],
    fechaCheckOut: ['', Validators.required],
    cantidadHuespedes: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  get f() { return this.form.controls; }

  buscar(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);
    this.buscado.set(false);

    const consulta = this.form.getRawValue() as ConsultaDisponibilidadDTO;

    this.disponibilidadService.buscarDisponibilidad(consulta).subscribe({
      next: (resultados) => {
        this.habitaciones.set(resultados);
        this.buscado.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message ?? 'Error al buscar disponibilidad');
        this.loading.set(false);
      },
    });
  }

  seleccionar(habitacion: HabitacionDisponibleDTO): void {
    const consulta = this.form.getRawValue() as ConsultaDisponibilidadDTO;
    this.reservaEstado.seleccionarHabitacion(habitacion, consulta);
    this.router.navigate(['/reservas/confirmar']);
  }
}

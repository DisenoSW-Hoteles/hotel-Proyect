import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sucursal, ConsultaDisponibilidadDTO, HabitacionDisponibleDTO } from 'shared-models';
import { IDisponibilidadService, DISPONIBILIDAD_SERVICE } from '../../services/disponibilidad.interface';
import { mapSucursalToApi } from '../../services/disponibilidad';
import { ReservaEstadoService } from '../../services/reserva-estado.service';
import { fechaCheckInNoPasada, fechasValidator } from '../../../../shared/validators/fecha.validators';

const SUCURSAL_LABELS: Record<Sucursal, string> = {
  [Sucursal.Temuco]: 'Temuco',
  [Sucursal.Pucon]: 'Pucón',
  [Sucursal.Santiago]: 'Santiago',
  [Sucursal.VinaDelMar]: 'Viña del Mar',
};

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

  readonly hoy = new Date().toISOString().split('T')[0];

  readonly sucursales = Object.values(Sucursal);
  readonly sucursalLabel = SUCURSAL_LABELS;
  readonly habitaciones = signal<HabitacionDisponibleDTO[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly buscado = signal(false);

  readonly form = this.fb.nonNullable.group({
    sucursalId: ['' as Sucursal, Validators.required],
    fechaCheckIn: ['', Validators.required],
    fechaCheckOut: ['', Validators.required],
    cantidadHuespedes: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  }, { validators: fechasValidator });

  get f() { return this.form.controls; }

  buscar(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);
    this.buscado.set(false);

    const raw = this.form.getRawValue();
    const consulta: ConsultaDisponibilidadDTO = {
      fechaCheckIn: raw.fechaCheckIn,
      fechaCheckOut: raw.fechaCheckOut,
      cantidadHuespedes: raw.cantidadHuespedes,
      sucursalNombre: mapSucursalToApi(raw.sucursalId),
    };

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
    const raw = this.form.getRawValue();
    const consulta: ConsultaDisponibilidadDTO = {
      fechaCheckIn: raw.fechaCheckIn,
      fechaCheckOut: raw.fechaCheckOut,
      cantidadHuespedes: raw.cantidadHuespedes,
      sucursalNombre: mapSucursalToApi(raw.sucursalId),
    };
    this.reservaEstado.seleccionarHabitacion(habitacion, consulta);
    this.router.navigate(['/reservas/confirmar']);
  }
}

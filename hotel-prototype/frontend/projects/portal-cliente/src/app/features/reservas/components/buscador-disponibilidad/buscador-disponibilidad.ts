import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sucursal, ConsultaDisponibilidadDTO, HabitacionDisponibleDTO } from 'shared-models';
import { IDisponibilidadService, DISPONIBILIDAD_SERVICE } from '../../services/disponibilidad.interface';
import { ReservaEstadoService } from '../../services/reserva-estado.service';

/** Etiquetas legibles para mostrar al usuario (el valor enviado al backend es el enum). */
const SUCURSAL_LABEL: Record<string, string> = {
  [Sucursal.Temuco]: 'Temuco',
  [Sucursal.Pucon]: 'Pucón',
  [Sucursal.Santiago]: 'Santiago',
  [Sucursal.Vina_Del_Mar]: 'Viña del Mar',
};

/** Devuelve una fecha en formato yyyy-MM-dd desplazada `offsetDays` desde hoy. */
function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

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

  /** Fecha mínima seleccionable: hoy. El check-out arranca mañana. */
  readonly hoy = isoDate(0);

  readonly form = this.fb.nonNullable.group({
    sucursalNombre: ['', Validators.required],
    fechaCheckIn: [isoDate(0), Validators.required],
    fechaCheckOut: [isoDate(1), Validators.required],
    cantidadHuespedes: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  /** Cantidad de noches entre check-in y check-out (mínimo informativo). */
  noches(): number {
    const { fechaCheckIn, fechaCheckOut } = this.form.getRawValue();
    if (!fechaCheckIn || !fechaCheckOut) return 0;
    const diff = new Date(fechaCheckOut).getTime() - new Date(fechaCheckIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }

  constructor() {
    // Si el usuario cambia el check-in, garantizamos que el check-out sea posterior.
    this.form.controls.fechaCheckIn.valueChanges.subscribe((checkIn) => {
      const checkOut = this.form.controls.fechaCheckOut.value;
      if (checkIn && (!checkOut || checkOut <= checkIn)) {
        const siguiente = new Date(checkIn);
        siguiente.setDate(siguiente.getDate() + 1);
        this.form.controls.fechaCheckOut.setValue(siguiente.toISOString().split('T')[0]);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  /** El check-out no puede ser anterior o igual al check-in. */
  get minCheckOut(): string {
    const checkIn = this.form.controls.fechaCheckIn.value || this.hoy;
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  get fechasValidas(): boolean {
    const { fechaCheckIn, fechaCheckOut } = this.form.getRawValue();
    return !!fechaCheckIn && !!fechaCheckOut && fechaCheckOut > fechaCheckIn;
  }

  sucursalLabel(valor: string): string {
    return SUCURSAL_LABEL[valor] ?? valor;
  }

  iconoTipo(tipo: string): string {
    const t = tipo?.toLowerCase() ?? '';
    if (t.includes('suite')) return 'king_bed';
    if (t.includes('plus')) return 'bed';
    return 'hotel';
  }

  buscar(): void {
    if (this.form.invalid || !this.fechasValidas) {
      this.form.markAllAsTouched();
      return;
    }

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
        this.error.set(err?.error?.message ?? err?.message ?? 'Error al buscar disponibilidad');
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

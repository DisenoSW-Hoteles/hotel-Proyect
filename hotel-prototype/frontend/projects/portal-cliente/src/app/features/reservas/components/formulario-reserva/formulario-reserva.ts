import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoServicio, CrearReservaDTO, ReservaDTO, Sucursal } from 'shared-models';
import { IDisponibilidadService, DISPONIBILIDAD_SERVICE } from '../../services/disponibilidad.interface';
import { ReservaEstadoService } from '../../services/reserva-estado.service';

@Component({
  selector: 'app-formulario-reserva',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './formulario-reserva.html',
  styleUrl: './formulario-reserva.scss',
})
export class FormularioReserva {
  private readonly fb = inject(FormBuilder);
  private readonly disponibilidadService = inject<IDisponibilidadService>(DISPONIBILIDAD_SERVICE);
  private readonly router = inject(Router);
  private readonly reservaEstado = inject(ReservaEstadoService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly confirmacion = signal<ReservaDTO | null>(this.reservaEstado.reservaConfirmada());

  readonly serviciosDisponibles: { value: TipoServicio; label: string }[] = [
    { value: TipoServicio.DesayunoHabitacion, label: 'Desayuno en habitación ($8,000)' },
    { value: TipoServicio.DesayunoCafeteria, label: 'Desayuno en cafetería ($5,000)' },
    { value: TipoServicio.EventoPrivado, label: 'Evento privado (Suite Ejecutiva, $50,000)' },
  ];

  readonly habitacion = this.reservaEstado.habitacionSeleccionada;
  readonly consulta = this.reservaEstado.consultaActual;

  /** Noches según las fechas de la consulta (mínimo 1). */
  readonly noches = computed(() => {
    const c = this.consulta();
    if (!c?.fechaCheckIn || !c?.fechaCheckOut) return 1;
    const diff = new Date(c.fechaCheckOut).getTime() - new Date(c.fechaCheckIn).getTime();
    return Math.max(1, Math.round(diff / 86400000));
  });

  /** Total estimado = precio por noche × noches (referencial; el backend confirma el valor real). */
  readonly totalEstimado = computed(() => (this.habitacion()?.precioPorNoche ?? 0) * this.noches());

  readonly form = this.fb.nonNullable.group({
    huespedNombre: ['', [Validators.required, Validators.minLength(3)]],
    huespedEmail: ['', [Validators.required, Validators.email]],
    huespedTelefono: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-]{8,15}$/)]],
    servicios: this.fb.nonNullable.control<TipoServicio[]>([], { validators: [] }),
  });

  constructor() {
    if (!this.habitacion() || !this.consulta()) {
      this.router.navigate(['/reservas/buscar']);
    }
  }

  toggleServicio(servicio: TipoServicio): void {
    const current = this.form.controls.servicios.value;
    if (current.includes(servicio)) {
      this.form.controls.servicios.setValue(current.filter(s => s !== servicio));
    } else {
      this.form.controls.servicios.setValue([...current, servicio]);
    }
  }

  reservar(): void {
    if (this.form.invalid || !this.habitacion() || !this.consulta()) return;

    this.loading.set(true);
    this.error.set(null);

    const payload: CrearReservaDTO = {
      habitacionId: this.habitacion()!.id,
      sucursalId: this.consulta()!.sucursalNombre as Sucursal,
      fechaCheckIn: this.consulta()!.fechaCheckIn,
      fechaCheckOut: this.consulta()!.fechaCheckOut,
      cantidadHuespedes: this.consulta()!.cantidadHuespedes,
      huespedNombre: this.form.getRawValue().huespedNombre,
      huespedEmail: this.form.getRawValue().huespedEmail,
      huespedTelefono: this.form.getRawValue().huespedTelefono,
      servicios: this.form.getRawValue().servicios,
    };

    this.disponibilidadService.crearReserva(payload).subscribe({
      next: (reserva) => {
        this.reservaEstado.confirmarReserva(reserva);
        this.confirmacion.set(reserva);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message ?? 'Error al crear la reserva');
        this.loading.set(false);
      },
    });
  }

  nuevaReserva(): void {
    this.reservaEstado.limpiar();
    this.router.navigate(['/reservas/buscar']);
  }
}

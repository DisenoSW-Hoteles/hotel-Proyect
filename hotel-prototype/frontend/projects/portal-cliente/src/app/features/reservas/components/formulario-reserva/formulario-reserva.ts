import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoServicio, CrearReservaDTO, ReservaDTO } from 'shared-models';
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
      this.form.controls.servicios.setValue(current.filter((s) => s !== servicio));
    } else {
      this.form.controls.servicios.setValue([...current, servicio]);
    }
  }

  reservar(): void {
    if (this.form.invalid || !this.habitacion() || !this.consulta()) return;

    this.loading.set(true);
    this.error.set(null);

    const c = this.consulta()!;
    const raw = this.form.getRawValue();
    const payload: CrearReservaDTO = {
      habitacionId: this.habitacion()!.id,
      sucursalNombre: c.sucursalNombre,
      fechaCheckIn: c.fechaCheckIn,
      fechaCheckOut: c.fechaCheckOut,
      cantidadHuespedes: c.cantidadHuespedes,
      huespedNombre: raw.huespedNombre,
      huespedEmail: raw.huespedEmail,
      huespedTelefono: raw.huespedTelefono,
      servicios: raw.servicios,
      tipoDocumento: 'RUT',
      documentoNum: raw.huespedEmail.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase(),
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

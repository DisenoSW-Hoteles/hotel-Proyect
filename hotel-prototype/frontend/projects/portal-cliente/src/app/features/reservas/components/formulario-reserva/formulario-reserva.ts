import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoServicio, CrearReservaDTO, ReservaDTO, Sucursal } from 'shared-models';
import { IDisponibilidadService, DISPONIBILIDAD_SERVICE } from '../../services/disponibilidad.interface';
import { ReservaEstadoService } from '../../services/reserva-estado.service';

const fechaPosteriorValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const checkIn = control.get('fechaCheckIn')?.value;
  const checkOut = control.get('fechaCheckOut')?.value;
  if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
    return { fechaInvalida: 'Check-out debe ser posterior a Check-in' };
  }
  return null;
};

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

  readonly hoy = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group({
    fechaCheckIn: ['', Validators.required],
    fechaCheckOut: ['', Validators.required],
    huespedNombre: ['', [Validators.required, Validators.minLength(3)]],
    huespedEmail: ['', [Validators.required, Validators.email]],
    huespedTelefono: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-]{8,15}$/)]],
    servicios: this.fb.nonNullable.control<TipoServicio[]>([], { validators: [] }),
  }, { validators: fechaPosteriorValidator });

  constructor() {
    if (this.consulta()) {
      this.form.patchValue({
        fechaCheckIn: this.consulta()!.fechaCheckIn,
        fechaCheckOut: this.consulta()!.fechaCheckOut,
      });
    }
  }

  get f() { return this.form.controls; }

  toggleServicio(servicio: TipoServicio): void {
    const current = this.form.controls.servicios.value;
    if (current.includes(servicio)) {
      this.form.controls.servicios.setValue(current.filter(s => s !== servicio));
    } else {
      this.form.controls.servicios.setValue([...current, servicio]);
    }
  }

  reservar(): void {
    if (this.form.invalid || !this.habitacion()) return;

    this.loading.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();

    const payload: CrearReservaDTO = {
      habitacionId: this.habitacion()!.id,
      sucursalId: this.consulta()?.sucursalId ?? Sucursal.Santiago,
      fechaCheckIn: raw.fechaCheckIn,
      fechaCheckOut: raw.fechaCheckOut,
      cantidadHuespedes: this.consulta()?.cantidadHuespedes ?? 1,
      huespedNombre: raw.huespedNombre,
      huespedEmail: raw.huespedEmail,
      huespedTelefono: raw.huespedTelefono,
      servicios: raw.servicios,
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
    this.router.navigate(['/reservas/catalogo']);
  }
}

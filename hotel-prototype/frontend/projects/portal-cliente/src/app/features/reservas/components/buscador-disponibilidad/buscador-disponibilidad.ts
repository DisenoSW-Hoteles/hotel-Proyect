import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sucursal, ConsultaDisponibilidadDTO, HabitacionDisponibleDTO } from 'shared-models';
import { IDisponibilidadService, DISPONIBILIDAD_SERVICE } from '../../services/disponibilidad.interface';
import { ReservaEstadoService } from '../../services/reserva-estado.service';

/**
 * Validador de grupo: el check-out debe ser POSTERIOR al check-in.
 * Las fechas son 'YYYY-MM-DD', cuyo orden lexicográfico coincide con el cronológico.
 */
const rangoFechasValidator = (group: AbstractControl): ValidationErrors | null => {
  const entrada = group.get('fechaCheckIn')?.value;
  const salida = group.get('fechaCheckOut')?.value;
  if (!entrada || !salida) return null;
  return salida > entrada ? null : { rangoFechas: true };
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

  readonly sucursales = Object.values(Sucursal);
  /** Etiquetas legibles para el desplegable (el valor enviado sigue siendo el valor del enum). */
  readonly etiquetasSucursal: Record<string, string> = {
    Temuco: 'Temuco',
    Pucon: 'Pucón',
    Santiago: 'Santiago',
    Vina_Del_Mar: 'Viña del Mar',
  };
  readonly habitaciones = signal<HabitacionDisponibleDTO[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly buscado = signal(false);

  /** Fecha mínima seleccionable (hoy) en formato YYYY-MM-DD. */
  readonly hoy = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group(
    {
      sucursalNombre: ['', Validators.required],
      fechaCheckIn: ['', Validators.required],
      fechaCheckOut: ['', Validators.required],
      cantidadHuespedes: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    },
    { validators: rangoFechasValidator }
  );

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

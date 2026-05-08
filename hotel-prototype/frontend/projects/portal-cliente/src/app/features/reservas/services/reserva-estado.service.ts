import { Injectable, signal } from '@angular/core';
import { HabitacionDisponibleDTO, ConsultaDisponibilidadDTO, ReservaDTO } from 'shared-models';

@Injectable({ providedIn: 'root' })
export class ReservaEstadoService {
  readonly habitacionSeleccionada = signal<HabitacionDisponibleDTO | null>(null);
  readonly consultaActual = signal<ConsultaDisponibilidadDTO | null>(null);
  readonly reservaConfirmada = signal<ReservaDTO | null>(null);

  seleccionarHabitacion(habitacion: HabitacionDisponibleDTO, consulta: ConsultaDisponibilidadDTO): void {
    this.habitacionSeleccionada.set(habitacion);
    this.consultaActual.set(consulta);
    this.reservaConfirmada.set(null);
  }

  confirmarReserva(reserva: ReservaDTO): void {
    this.reservaConfirmada.set(reserva);
  }

  limpiar(): void {
    this.habitacionSeleccionada.set(null);
    this.consultaActual.set(null);
    this.reservaConfirmada.set(null);
  }
}

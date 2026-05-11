import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { ConsultaDisponibilidadDTO, HabitacionDisponibleDTO, CrearReservaDTO, ReservaDTO } from 'shared-models';
import { TipoHabitacion } from 'shared-models';
import { TipoServicio } from 'shared-models';

import { IDisponibilidadService } from './disponibilidad.interface';

const HABITACIONES_MOCK: HabitacionDisponibleDTO[] = [
  { id: 1, tipoHabitacion: TipoHabitacion.Estandar, capacidadMaxima: 2, precioPorNoche: 45000, descripcionBreve: 'Habitación estándar con cama matrimonial, baño privado y TV.' },
  { id: 2, tipoHabitacion: TipoHabitacion.Estandar, capacidadMaxima: 3, precioPorNoche: 55000, descripcionBreve: 'Habitación estándar con dos camas individuales, baño privado y TV.' },
  { id: 3, tipoHabitacion: TipoHabitacion.Plus, capacidadMaxima: 2, precioPorNoche: 75000, descripcionBreve: 'Habitación Plus con cama King Size, jacuzzi y vista panorámica.' },
  { id: 4, tipoHabitacion: TipoHabitacion.Plus, capacidadMaxima: 4, precioPorNoche: 95000, descripcionBreve: 'Habitación Plus familiar con dos camas Queen, sala de estar y terraza.' },
  { id: 5, tipoHabitacion: TipoHabitacion.SuiteEjecutiva, capacidadMaxima: 2, precioPorNoche: 150000, descripcionBreve: 'Suite Ejecutiva con dormitorio separado, living, cocina equipada y vista al mar.' },
  { id: 6, tipoHabitacion: TipoHabitacion.SuiteEjecutiva, capacidadMaxima: 4, precioPorNoche: 200000, descripcionBreve: 'Suite Ejecutiva Premium con dos habitaciones, salón de eventos para 25 personas y terraza privada.' },
];

@Injectable()
export class DisponibilidadMockService implements IDisponibilidadService {
  buscarDisponibilidad(consulta: ConsultaDisponibilidadDTO): Observable<HabitacionDisponibleDTO[]> {
    const filtradas = HABITACIONES_MOCK.filter(h => h.capacidadMaxima >= consulta.cantidadHuespedes);
    return of(filtradas).pipe(delay(600));
  }

  crearReserva(reserva: CrearReservaDTO): Observable<ReservaDTO> {
    if (!reserva.huespedEmail.includes('@')) {
      return throwError(() => new Error('Email inválido'));
    }
    const habitacion = HABITACIONES_MOCK.find(h => h.id === reserva.habitacionId);
    const noches = this.calcularNoches(reserva.fechaCheckIn, reserva.fechaCheckOut);
    const totalEstimado = (habitacion?.precioPorNoche ?? 0) * noches;
    const respuesta: ReservaDTO = {
      id: Math.floor(Math.random() * 1000) + 100,
      habitacionId: reserva.habitacionId,
      tipoHabitacion: habitacion?.tipoHabitacion ?? TipoHabitacion.Estandar,
      sucursalNombre: reserva.sucursalNombre,
      fechaCheckIn: reserva.fechaCheckIn,
      fechaCheckOut: reserva.fechaCheckOut,
      cantidadHuespedes: reserva.cantidadHuespedes,
      huespedNombre: reserva.huespedNombre,
      huespedEmail: reserva.huespedEmail,
      huespedTelefono: reserva.huespedTelefono,
      servicios: reserva.servicios,
      totalEstimado,
      fechaCreacion: new Date().toISOString(),
    };
    return of(respuesta).pipe(delay(400));
  }

  private calcularNoches(checkIn: string, checkOut: string): number {
    const inicio = new Date(checkIn);
    const fin = new Date(checkOut);
    return Math.max(1, Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
  }
}

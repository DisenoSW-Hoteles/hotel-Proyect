/** Contratos del flujo de creación de reserva desde el portal público. */

/** Cuerpo enviado por el portal-cliente en POST /api/reservas. */
export interface CrearReservaDTO {
  habitacionId: number;
  sucursalId: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  servicios: string[];
}

/** Respuesta con la reserva creada (coincide con ReservaDTO de shared-models). */
export interface ReservaPublicaDTO {
  id: number;
  habitacionId: number;
  tipoHabitacion: string;
  sucursalId: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  cantidadHuespedes: number;
  huespedNombre: string;
  huespedEmail: string;
  huespedTelefono: string;
  servicios: string[];
  /** Tarifa por noche aplicada (desde regla_tarifa). */
  precioPorNoche: number;
  /** Cantidad de noches de la estadía. */
  noches: number;
  totalEstimado: number;
  fechaCreacion: string;
}

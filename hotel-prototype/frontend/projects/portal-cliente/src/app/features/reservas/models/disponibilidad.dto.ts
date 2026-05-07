// DTO para la petición (Request)
export interface ConsultaDisponibilidadDTO {
  fechaCheckIn: string; // Formato ISO YYYY-MM-DD
  fechaCheckOut: string; 
  cantidadHuespedes: number;
}

// DTO para la respuesta (Response)
export interface HabitacionDisponibleDTO {
  id: string; 
  tipoHabitacion: string; 
  capacidadMaxima: number;
  precioPorNoche: number;
  descripcionBreve?: string; 
}
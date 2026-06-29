import { AppError } from '../../utils/errors/AppError';
import { CrearReservaRequestDTO } from '../../models/dtos/Reserva.dto';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ReservaValidation {
  static validarCrearReserva(dto: CrearReservaRequestDTO): void {
    const errors: string[] = [];

    if (!dto.habitacionId || dto.habitacionId < 1) {
      errors.push('La habitación es obligatoria.');
    }

    if (!dto.sucursalNombre || dto.sucursalNombre.trim().length === 0) {
      errors.push('La sucursal es obligatoria.');
    }

    if (!dto.huespedNombre || dto.huespedNombre.trim().length < 3) {
      errors.push('El nombre del huésped debe tener al menos 3 caracteres.');
    }

    if (!dto.documentoNum || dto.documentoNum.trim().length < 5) {
      errors.push('El RUT o Pasaporte es obligatorio (mín. 5 caracteres).');
    }

    if (!dto.tipoDocumento || !['RUT', 'PASAPORTE'].includes(dto.tipoDocumento)) {
      errors.push('El tipo de documento debe ser RUT o PASAPORTE.');
    }

    if (!dto.fechaCheckIn || !dto.fechaCheckOut) {
      errors.push('Las fechas de check-in y check-out son obligatorias.');
    } else {
      const checkIn = new Date(dto.fechaCheckIn);
      const checkOut = new Date(dto.fechaCheckOut);
      if (isNaN(checkIn.getTime())) {
        errors.push('La fecha de check-in no es válida.');
      }
      if (isNaN(checkOut.getTime())) {
        errors.push('La fecha de check-out no es válida.');
      }
      if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
        if (checkOut <= checkIn) {
          errors.push('La fecha de check-out debe ser posterior al check-in.');
        }
        if (checkIn < new Date(new Date().toDateString())) {
          errors.push('La fecha de check-in no puede ser pasada.');
        }
      }
    }

    if (!dto.cantidadHuespedes || dto.cantidadHuespedes < 1) {
      errors.push('Debe haber al menos 1 huésped.');
    }

    if (errors.length > 0) {
      throw new AppError(errors.join(' '), 400);
    }
  }

  static validarDocumento(documento: string): void {
    if (!documento || documento.trim().length < 3) {
      throw new AppError('Debe ingresar un RUT o Pasaporte válido para la búsqueda.', 400);
    }
  }
}

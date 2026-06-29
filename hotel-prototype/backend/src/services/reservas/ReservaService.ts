import { AppDataSource } from '../../config/database';
import { Cliente } from '../../models/entities/Cliente.entity';
import { Reserva } from '../../models/entities/Reserva.entity';
import { Habitacion } from '../../models/entities/Habitacion.entity';
import { Sucursal } from '../../models/entities/Sucursal.entity';
import {
  CrearReservaRequestDTO,
  CrearReservaResponseDTO,
  AdminReservationResponseDto,
} from '../../models/dtos/Reserva.dto';
import { ReservaValidation } from './ReservaValidation';
import { IReservaService } from '../../interfaces/IReservaService';
import { AppError } from '../../utils/errors/AppError';

export class ReservaService implements IReservaService {
  private readonly clienteRepo = AppDataSource.getRepository(Cliente);
  private readonly reservaRepo = AppDataSource.getRepository(Reserva);
  private readonly habitacionRepo = AppDataSource.getRepository(Habitacion);
  private readonly sucursalRepo = AppDataSource.getRepository(Sucursal);

  async crearReserva(dto: CrearReservaRequestDTO): Promise<CrearReservaResponseDTO> {
    ReservaValidation.validarCrearReserva(dto);

    const habitacion = await this.habitacionRepo.findOne({ where: { id: dto.habitacionId } });
    if (!habitacion) {
      throw new AppError('La habitación seleccionada no existe.', 404);
    }

    const sucursal = await this.sucursalRepo.findOne({ where: { nombre: dto.sucursalNombre.toUpperCase() } });
    if (!sucursal) {
      throw new AppError('La sucursal seleccionada no existe.', 404);
    }

    let cliente = await this.clienteRepo.findOne({ where: { documentoNum: dto.documentoNum } });
    if (!cliente) {
      cliente = this.clienteRepo.create({
        nombres: dto.huespedNombre.split(' ')[0] || dto.huespedNombre,
        apellidos: dto.huespedNombre.split(' ').slice(1).join(' ') || 'No especificado',
        email: dto.huespedEmail || `${dto.documentoNum}@temp.cl`,
        telefono: dto.huespedTelefono || '',
        tipoDocumento: dto.tipoDocumento,
        documentoNum: dto.documentoNum,
        fechaNacimiento: '2000-01-01',
        nacionalidad: 'CHILENA',
      });
      cliente = await this.clienteRepo.save(cliente);
    }

    const checkIn = new Date(dto.fechaCheckIn);
    const checkOut = new Date(dto.fechaCheckOut);
    const noches = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const precioPorNoche = 50000;
    const precioTotal = noches * precioPorNoche;

    const reserva = this.reservaRepo.create({
      clienteId: cliente.id,
      habitacionId: dto.habitacionId,
      sucursalId: sucursal.id,
      reglaTarifaId: 1,
      fechaEntrada: dto.fechaCheckIn,
      fechaSalida: dto.fechaCheckOut,
      numHuespedes: dto.cantidadHuespedes,
      estado: 'CONFIRMADA',
      subtotalHabitacion: precioTotal,
      precioTotal,
      notas: '',
    });
    const saved = await this.reservaRepo.save(reserva);

    const confirmationCode = this.generarCodigoConfirmacion(saved.id);
    await this.reservaRepo.update(saved.id, { codigoConfirmacion: confirmationCode });

    return {
      id: saved.id,
      confirmationCode,
      huespedNombre: dto.huespedNombre,
      documentoNum: dto.documentoNum,
      habitacionId: dto.habitacionId,
      sucursalNombre: sucursal.nombre,
      fechaCheckIn: dto.fechaCheckIn,
      fechaCheckOut: dto.fechaCheckOut,
      cantidadHuespedes: dto.cantidadHuespedes,
      precioTotal: Number(saved.precioTotal),
      estado: saved.estado,
    };
  }

  async buscarPorDocumento(documento: string): Promise<AdminReservationResponseDto[]> {
    ReservaValidation.validarDocumento(documento);

    const reservas = await this.reservaRepo.createQueryBuilder('r')
      .innerJoinAndSelect('r.cliente', 'c')
      .innerJoinAndSelect('r.habitacion', 'h')
      .innerJoinAndSelect('r.sucursal', 's')
      .where('c.documentoNum = :documento', { documento })
      .orderBy('r.fechaEntrada', 'DESC')
      .getMany();

    return reservas.map(r => this.mapearAdminResponse(r));
  }

  async buscarPorId(id: string): Promise<AdminReservationResponseDto | null> {
    const reserva = await this.reservaRepo.createQueryBuilder('r')
      .innerJoinAndSelect('r.cliente', 'c')
      .innerJoinAndSelect('r.habitacion', 'h')
      .innerJoinAndSelect('r.sucursal', 's')
      .where('r.id = :id OR r.codigoConfirmacion = :id', { id })
      .getOne();

    if (!reserva) return null;
    return this.mapearAdminResponse(reserva);
  }

  private mapearAdminResponse(r: Reserva): AdminReservationResponseDto {
    return {
      id: r.id,
      confirmation_code: r.codigoConfirmacion || this.generarCodigoConfirmacion(r.id),
      guest: {
        id: r.cliente?.id || '',
        first_name: r.cliente?.nombres || '',
        last_name: r.cliente?.apellidos || '',
        document_number: r.cliente?.documentoNum || '',
        document_type: r.cliente?.tipoDocumento || '',
        nationality: r.cliente?.nacionalidad || '',
        email: r.cliente?.email || '',
        phone: r.cliente?.telefono || '',
      },
      room: {
        id: r.habitacion?.id || 0,
        number: r.habitacion?.numero || '',
        type: r.habitacion?.tipo || '',
      },
      check_in_date: r.fechaEntrada,
      check_out_date: r.fechaSalida,
      declared_companions: r.numHuespedes - 1,
      registered_companions: [],
      status: r.estado,
      special_requests: r.notas || '',
      branch: r.sucursal?.nombre || '',
    };
  }

  private generarCodigoConfirmacion(uuid: string): string {
    const short = uuid.replace(/-/g, '').substring(0, 8).toUpperCase();
    return `HTL-${short}`;
  }
}

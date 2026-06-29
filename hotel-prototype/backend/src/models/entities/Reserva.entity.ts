import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './Cliente.entity';
import { Habitacion } from './Habitacion.entity';
import { Sucursal } from './Sucursal.entity';

@Entity('reserva')
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'cliente_id' })
  clienteId!: string;

  @Column({ name: 'habitacion_id' })
  habitacionId!: number;

  @Column({ name: 'sucursal_id' })
  sucursalId!: number;

  @Column({ name: 'regla_tarifa_id' })
  reglaTarifaId!: number;

  @Column({ name: 'codigo_confirmacion', nullable: true })
  codigoConfirmacion!: string;

  @Column({ name: 'fecha_entrada', type: 'date' })
  fechaEntrada!: string;

  @Column({ name: 'fecha_salida', type: 'date' })
  fechaSalida!: string;

  @Column({ name: 'num_huespedes' })
  numHuespedes!: number;

  @Column({ type: 'enum', enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW'], default: 'PENDIENTE' })
  estado!: string;

  @Column({ name: 'modalidad_desayuno', type: 'enum', enum: ['EN_HABITACION', 'EN_CAFETERIA', 'NO_INCLUIDO'], default: 'NO_INCLUIDO' })
  modalidadDesayuno!: string;

  @Column({ name: 'desayuno_bonificado', default: false })
  desayunoBonificado!: boolean;

  @Column({ name: 'tiene_evento_privado', default: false })
  tieneEventoPrivado!: boolean;

  @Column({ name: 'acepta_terminos_legales', default: false })
  aceptaTerminosLegales!: boolean;

  @Column({ name: 'subtotal_habitacion', type: 'numeric', precision: 12, scale: 2 })
  subtotalHabitacion!: number;

  @Column({ name: 'cargo_personas_extra', type: 'numeric', precision: 12, scale: 2, default: 0 })
  cargoPersonasExtra!: number;

  @Column({ name: 'cargo_evento', type: 'numeric', precision: 12, scale: 2, default: 0 })
  cargoEvento!: number;

  @Column({ name: 'descuento_aplicado', type: 'numeric', precision: 12, scale: 2, default: 0 })
  descuentoAplicado!: number;

  @Column({ name: 'exento_iva', default: false })
  exentoIva!: boolean;

  @Column({ name: 'precio_total', type: 'numeric', precision: 12, scale: 2 })
  precioTotal!: number;

  @Column({ name: 'metodo_pago', type: 'enum', enum: ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'CARGO_HABITACION', 'PENDIENTE'], default: 'PENDIENTE' })
  metodoPago!: string;

  @Column({ nullable: true })
  notas!: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente!: Cliente;

  @ManyToOne(() => Habitacion)
  @JoinColumn({ name: 'habitacion_id' })
  habitacion!: Habitacion;

  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'sucursal_id' })
  sucursal!: Sucursal;
}

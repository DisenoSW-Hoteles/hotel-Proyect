import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('habitacion')
export class Habitacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numero!: string;

  @Column()
  piso!: number;

  @Column({ type: 'enum', enum: ['ESTANDAR', 'PLUS', 'SUITE_EJECUTIVA'] })
  tipo!: string;

  @Column({ name: 'capacidad_maxima' })
  capacidadMaxima!: number;

  @Column({ name: 'estado', default: 'DISPONIBLE' })
  estado!: string;

  @Column({ name: 'sucursal_id' })
  sucursalId!: number;
}

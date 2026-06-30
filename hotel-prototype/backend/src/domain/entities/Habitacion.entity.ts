import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entidad de dominio Habitación. El mapeo ORM (decoradores TypeORM) se mantiene
 * aquí por simplicidad del MVP; la persistencia concreta vive en la capa de
 * infraestructura (TypeOrmHabitacionRepository).
 */
@Entity('habitacion')
export class Habitacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numero!: string;

  @Column({ type: 'enum', enum: ['ESTANDAR', 'PLUS', 'SUITE_EJECUTIVA'] })
  tipo!: string;

  @Column({ name: 'capacidad_maxima' })
  capacidadMaxima!: number;

  @Column({ name: 'sucursal_id' })
  sucursalId!: number;
}

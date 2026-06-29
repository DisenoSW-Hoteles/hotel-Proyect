import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sucursal')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: ['TEMUCO', 'PUCON', 'SANTIAGO', 'VINA_DEL_MAR'] })
  nombre!: string;

  @Column()
  direccion!: string;

  @Column()
  ciudad!: string;

  @Column({ name: 'region_tributaria' })
  regionTributaria!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column({ default: true })
  activo!: boolean;
}

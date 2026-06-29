import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column({ name: 'tipo_documento', type: 'enum', enum: ['RUT', 'PASAPORTE'] })
  tipoDocumento!: string;

  @Column({ name: 'documento_num' })
  documentoNum!: string;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento!: string;

  @Column()
  nacionalidad!: string;
}

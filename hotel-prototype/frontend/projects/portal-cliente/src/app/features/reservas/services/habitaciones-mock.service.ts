import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { HabitacionCatalogoDTO, TipoHabitacion } from 'shared-models';
import { IHabitacionesService } from './habitaciones.interface';

const CATALOGO_MOCK: HabitacionCatalogoDTO[] = [
  {
    id: 1,
    tipo: TipoHabitacion.Estandar,
    titulo: 'Habitación Estándar',
    descripcion: 'Ideal para viajeros individuales o parejas. Habitación acogedora con cama matrimonial, baño privado, TV por cable, Wi-Fi gratuito y aire acondicionado. Perfecta para una estancia cómoda y económica.',
    capacidadMaxima: 2,
    precioBasePorNoche: 45000,
    amenities: ['Cama matrimonial', 'Baño privado', 'TV por cable', 'Wi-Fi', 'Aire acondicionado', 'Secador de pelo'],
    destacado: false,
  },
  {
    id: 2,
    tipo: TipoHabitacion.Estandar,
    titulo: 'Habitación Estándar Twin',
    descripcion: 'Perfecta para amigos o compañeros de viaje. Dos camas individuales, baño privado, escritorio de trabajo y todas las comodidades esenciales para una estancia productiva.',
    capacidadMaxima: 3,
    precioBasePorNoche: 55000,
    amenities: ['2 camas individuales', 'Baño privado', 'TV por cable', 'Wi-Fi', 'Escritorio', 'Aire acondicionado'],
    destacado: false,
  },
  {
    id: 3,
    tipo: TipoHabitacion.Plus,
    titulo: 'Habitación Plus',
    descripcion: 'Una categoría superior para quienes buscan mayor confort. Cama King Size, jacuzzi privado, vistas panorámicas, minibar y servicio a la habitación. Relájese con estilo.',
    capacidadMaxima: 2,
    precioBasePorNoche: 75000,
    amenities: ['Cama King Size', 'Jacuzzi', 'Vista panorámica', 'Minibar', 'TV Smart 50"', 'Wi-Fi premium', 'Caja fuerte', 'Room service'],
    destacado: true,
  },
  {
    id: 4,
    tipo: TipoHabitacion.Plus,
    titulo: 'Habitación Plus Familiar',
    descripcion: 'Espacio ideal para familias pequeñas. Dos camas Queen, sala de estar independiente, terraza privada y baño con derme de lluvia. Todo lo necesario para una estancia inolvidable.',
    capacidadMaxima: 4,
    precioBasePorNoche: 95000,
    amenities: ['2 camas Queen', 'Sala de estar', 'Terraza privada', 'TV Smart 55"', 'Wi-Fi premium', 'Minibar', 'Ducha de lluvia'],
    destacado: false,
  },
  {
    id: 5,
    tipo: TipoHabitacion.SuiteEjecutiva,
    titulo: 'Suite Ejecutiva',
    descripcion: 'Nuestra suite insignia. Dormitorio separado con cama King Size, living amplio, cocina equipada, vista al mar y acceso a lounge ejecutivo. La máxima experiencia hotelera.',
    capacidadMaxima: 2,
    precioBasePorNoche: 150000,
    amenities: ['Dormitorio separado', 'Living amplio', 'Cocina equipada', 'Vista al mar', 'Lounge ejecutivo', 'TV 65"', 'Wi-Fi premium', 'Cava de vinos', 'Mayordomo'],
    destacado: true,
  },
  {
    id: 6,
    tipo: TipoHabitacion.SuiteEjecutiva,
    titulo: 'Suite Ejecutiva Premium',
    descripcion: 'El pináculo del lujo. Dos habitaciones, salón de eventos para hasta 25 personas, terraza privada con piscina, cocina gourmet y servicio de mayordomo 24/7. Ideal para eventos exclusivos.',
    capacidadMaxima: 4,
    precioBasePorNoche: 200000,
    amenities: ['2 dormitorios', 'Salón de eventos (25 pers.)', 'Terraza con piscina', 'Cocina gourmet', 'Mayordomo 24/7', 'TV 75"', 'Wi-Fi premium', 'Cava de vinos', 'Estacionamiento privado'],
    destacado: true,
  },
];

@Injectable()
export class HabitacionesMockService implements IHabitacionesService {
  obtenerCatalogo(): Observable<HabitacionCatalogoDTO[]> {
    return of(CATALOGO_MOCK).pipe(delay(400));
  }
}

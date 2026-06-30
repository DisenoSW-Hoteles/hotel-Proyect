import { HotelBranch } from '../../../core/models';

// --- Domain ---

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
export type RoomType = 'STANDARD' | 'SUPERIOR' | 'DELUXE' | 'SUITE' | 'PREMIUM_SUITE';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  baseRate: number;
  status: RoomStatus;
  amenities: string[];
  branch: HotelBranch;
}

// --- DTOs (contratos del endpoint admin) ---

export interface RoomResponseDto {
  id: string;
  number: string;
  floor: number;
  type: string;
  capacity: number;
  base_rate: number;
  status: string;
  amenities: string[];
  branch: string;
}

export interface UpdateRoomRateDto {
  room_id: string;
  base_rate: number;
  effective_from: string;
  reason?: string;
}

// --- Mapper ---

export const mapRoomDtoToDomain = (dto: RoomResponseDto): Room => ({
  id: dto.id,
  number: dto.number,
  floor: dto.floor,
  type: dto.type as RoomType,
  capacity: dto.capacity,
  baseRate: dto.base_rate,
  status: dto.status as RoomStatus,
  amenities: dto.amenities,
  branch: dto.branch as HotelBranch,
});

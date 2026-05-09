import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Room } from '../../core/models';
import {
  RoomResponseDto,
  UpdateRoomRateRequestDto,
  mapRoomDtoToDomain,
} from '../models';

export interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_ROOM_STATE: RoomState = {
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly apiUrl = `${environment.apiBaseUrl}/rooms`;

  private readonly _state$ = new BehaviorSubject<RoomState>(INITIAL_ROOM_STATE);

  readonly state$ = this._state$.asObservable();
  readonly rooms$ = this.state$.pipe(map((state) => state.rooms));
  readonly selectedRoom$ = this.state$.pipe(map((state) => state.selectedRoom));

  constructor(private readonly http: HttpClient) {}

  loadRooms(branch?: string): Observable<Room[]> {
    this._patchState({ isLoading: true, error: null });

    const params = branch ? { branch } : undefined;

    return this.http
      .get<RoomResponseDto[]>(this.apiUrl, { params })
      .pipe(
        map((dtos) => dtos.map(mapRoomDtoToDomain)),
        tap((rooms) => {
          this._patchState({ rooms, isLoading: false });
        }),
        catchError((error) => {
          this._patchState({ isLoading: false, error: 'Error al cargar las habitaciones.' });
          return throwError(() => error);
        })
      );
  }

  updateBaseRate(request: UpdateRoomRateRequestDto): Observable<Room> {
    this._patchState({ isLoading: true, error: null });

    return this.http
      .patch<RoomResponseDto>(`${this.apiUrl}/${request.room_id}/base-rate`, request)
      .pipe(
        map(mapRoomDtoToDomain),
        tap((updatedRoom) => {
          const { rooms, selectedRoom } = this._state$.getValue();
          this._patchState({
            rooms: rooms.map((room) =>
              room.id === updatedRoom.id ? updatedRoom : room
            ),
            selectedRoom:
              selectedRoom?.id === updatedRoom.id ? updatedRoom : selectedRoom,
            isLoading: false,
          });
        }),
        catchError((error) => {
          this._patchState({ isLoading: false, error: 'Error al actualizar la tarifa.' });
          return throwError(() => error);
        })
      );
  }

  selectRoom(room: Room): void {
    this._patchState({ selectedRoom: room });
  }

  private _patchState(patch: Partial<RoomState>): void {
    this._state$.next({ ...this._state$.getValue(), ...patch });
  }
}

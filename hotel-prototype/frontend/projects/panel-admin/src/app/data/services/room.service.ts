import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Room } from '../../core/models';
import { RoomResponseDto, UpdateRoomRateDto, mapRoomDtoToDomain } from '../dtos';

export interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const INITIAL_STATE: RoomState = {
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly apiUrl = `${environment.apiBaseUrl}/rooms`;

  private readonly _state$ = new BehaviorSubject<RoomState>(INITIAL_STATE);

  readonly state$: Observable<RoomState> = this._state$.asObservable();

  readonly rooms$: Observable<Room[]> = this.state$.pipe(map((s) => s.rooms));

  readonly selectedRoom$: Observable<Room | null> = this.state$.pipe(
    map((s) => s.selectedRoom)
  );

  constructor(private readonly http: HttpClient) {}

  loadRooms(branch?: string): Observable<Room[]> {
    this._patchState({ isLoading: true, error: null });

    const params = branch ? `?branch=${branch}` : '';

    return this.http
      .get<RoomResponseDto[]>(`${this.apiUrl}${params}`)
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

  updateBaseRate(dto: UpdateRoomRateDto): Observable<Room> {
    this._patchState({ isSaving: true, error: null });

    return this.http
      .patch<RoomResponseDto>(`${this.apiUrl}/${dto.room_id}/rate`, dto)
      .pipe(
        map(mapRoomDtoToDomain),
        tap((updatedRoom) => {
          const currentRooms = this._state$.getValue().rooms;
          const updatedRooms = currentRooms.map((r) =>
            r.id === updatedRoom.id ? updatedRoom : r
          );
          this._patchState({ rooms: updatedRooms, isSaving: false });
        }),
        catchError((error) => {
          this._patchState({ isSaving: false, error: 'Error al actualizar la tarifa.' });
          return throwError(() => error);
        })
      );
  }

  private _patchState(patch: Partial<RoomState>): void {
    this._state$.next({ ...this._state$.getValue(), ...patch });
  }
}

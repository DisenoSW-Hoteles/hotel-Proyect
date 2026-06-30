import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Room, RoomResponseDto, UpdateRoomRateDto, mapRoomDtoToDomain } from '../models';

export interface RoomsState {
  rooms: Room[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const INITIAL_STATE: RoomsState = {
  rooms: [],
  isLoading: false,
  isSaving: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class RoomsService {
  // Endpoint administrativo — incluye habitaciones de todas las sucursales
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/rooms`;

  private readonly _state$ = new BehaviorSubject<RoomsState>(INITIAL_STATE);

  readonly state$: Observable<RoomsState> = this._state$.asObservable();
  readonly rooms$: Observable<Room[]> = this._state$.pipe(map((s) => s.rooms));

  constructor(private readonly http: HttpClient) {}

  loadRooms(branch?: string): Observable<Room[]> {
    this._patch({ isLoading: true, error: null });
    const params = branch ? `?branch=${branch}` : '';
    return this.http.get<RoomResponseDto[]>(`${this.apiUrl}${params}`).pipe(
      map((dtos) => dtos.map(mapRoomDtoToDomain)),
      tap((rooms) => this._patch({ rooms, isLoading: false })),
      catchError((err) => {
        this._patch({ isLoading: false, error: 'Error al cargar las habitaciones.' });
        return throwError(() => err);
      })
    );
  }

  updateBaseRate(dto: UpdateRoomRateDto): Observable<Room> {
    this._patch({ isSaving: true, error: null });
    return this.http.patch<RoomResponseDto>(`${this.apiUrl}/${dto.room_id}/rate`, dto).pipe(
      map(mapRoomDtoToDomain),
      tap((updated) => {
        const rooms = this._state$.getValue().rooms.map((r) =>
          r.id === updated.id ? updated : r
        );
        this._patch({ rooms, isSaving: false });
      }),
      catchError((err) => {
        this._patch({ isSaving: false, error: 'Error al actualizar la tarifa.' });
        return throwError(() => err);
      })
    );
  }

  private _patch(patch: Partial<RoomsState>): void {
    this._state$.next({ ...this._state$.getValue(), ...patch });
  }
}

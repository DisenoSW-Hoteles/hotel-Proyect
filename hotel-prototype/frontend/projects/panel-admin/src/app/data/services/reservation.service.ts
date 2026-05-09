import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Companion, Reservation } from '../../core/models';
import {
  CheckInRequestDto,
  CompanionDto,
  ReservationResponseDto,
  mapReservationDtoToDomain,
} from '../models';

export interface CheckInValidationResult {
  isValid: boolean;
  missingCompanions: number;
  companionsWithoutDocument: string[];
}

export interface ReservationState {
  activeReservation: Reservation | null;
  searchResults: Reservation[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
}

const INITIAL_STATE: ReservationState = {
  activeReservation: null,
  searchResults: [],
  isLoading: false,
  isProcessing: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly apiUrl = `${environment.apiBaseUrl}/reservations`;

  private readonly _state$ = new BehaviorSubject<ReservationState>(INITIAL_STATE);

  readonly state$ = this._state$.asObservable();
  readonly activeReservation$ = this.state$.pipe(map((s) => s.activeReservation));

  constructor(private readonly http: HttpClient) {}

  getCurrentReservation(): Reservation | null {
    return this._state$.getValue().activeReservation;
  }

  searchByCode(confirmationCode: string): Observable<Reservation> {
    this._patchState({ isLoading: true, error: null });

    return this.http
      .get<ReservationResponseDto>(`${this.apiUrl}/by-code/${confirmationCode}`)
      .pipe(
        map(mapReservationDtoToDomain),
        tap((reservation) => {
          this._patchState({ activeReservation: reservation, isLoading: false });
        }),
        catchError((error) => {
          const message =
            error.status === 404
              ? `No se encontró la reserva con código ${confirmationCode}.`
              : 'Error al buscar la reserva.';
          this._patchState({ isLoading: false, error: message });
          return throwError(() => error);
        })
      );
  }

  searchByGuestDocument(documentNumber: string): Observable<Reservation[]> {
    this._patchState({ isLoading: true, error: null });

    return this.http
      .get<ReservationResponseDto[]>(`${this.apiUrl}/by-guest/${documentNumber}`)
      .pipe(
        map((dtos) => dtos.map(mapReservationDtoToDomain)),
        tap((reservations) => {
          this._patchState({ searchResults: reservations, isLoading: false });
        }),
        catchError((error) => {
          this._patchState({ isLoading: false, error: 'Error al buscar por huésped.' });
          return throwError(() => error);
        })
      );
  }

  validateCheckInCompanions(
    reservation: Reservation,
    companions: Companion[]
  ): CheckInValidationResult {
    const registeredCount = companions.length;
    const declaredCount = reservation.declaredCompanions;
    const missingCompanions = Math.max(0, declaredCount - registeredCount);

    const companionsWithoutDocument = companions
      .filter((c) => !c.documentNumber || c.documentNumber.trim() === '')
      .map((c) => `${c.firstName} ${c.lastName}`);

    return {
      isValid: missingCompanions === 0 && companionsWithoutDocument.length === 0,
      missingCompanions,
      companionsWithoutDocument,
    };
  }

  executeCheckIn(
    reservation: Reservation,
    companions: Companion[],
    staffId: string
  ): Observable<Reservation> {
    this._patchState({ isProcessing: true, error: null });

    const dto: CheckInRequestDto = {
      reservation_id: reservation.id,
      companions: companions.map(
        (c): CompanionDto => ({
          first_name: c.firstName,
          last_name: c.lastName,
          document_number: c.documentNumber,
          document_type: c.documentType,
        })
      ),
      actual_check_in_time: new Date().toISOString(),
      staff_id: staffId,
    };

    return this.http
      .post<ReservationResponseDto>(`${this.apiUrl}/${reservation.id}/check-in`, dto)
      .pipe(
        map(mapReservationDtoToDomain),
        tap((updatedReservation) => {
          this._patchState({
            activeReservation: updatedReservation,
            isProcessing: false,
          });
        }),
        catchError((error) => {
          this._patchState({
            isProcessing: false,
            error: 'Error al procesar el check-in.',
          });
          return throwError(() => error);
        })
      );
  }

  setActiveReservation(reservation: Reservation): void {
    this._patchState({ activeReservation: reservation });
  }

  clearState(): void {
    this._state$.next(INITIAL_STATE);
  }

  private _patchState(patch: Partial<ReservationState>): void {
    this._state$.next({ ...this._state$.getValue(), ...patch });
  }
}

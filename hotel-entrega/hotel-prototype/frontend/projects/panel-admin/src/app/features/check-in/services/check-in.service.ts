import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Companion,
  Reservation,
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
export class CheckInService {
  // Endpoint administrativo — distinto del portal-cliente (/reservations)
  private readonly apiUrl = `${environment.apiBaseUrl}/admin/reservations`;

  private readonly _state$ = new BehaviorSubject<ReservationState>(INITIAL_STATE);

  readonly state$: Observable<ReservationState> = this._state$.asObservable();
  readonly activeReservation$: Observable<Reservation | null> = this._state$.pipe(
    map((s) => s.activeReservation)
  );

  constructor(private readonly http: HttpClient) {}

  searchByCode(confirmationCode: string): Observable<Reservation> {
    this._patch({ isLoading: true, error: null });
    return this.http
      .get<ReservationResponseDto>(`${this.apiUrl}/by-code/${confirmationCode}`)
      .pipe(
        map(mapReservationDtoToDomain),
        tap((res) => this._patch({ activeReservation: res, isLoading: false })),
        catchError((err) => {
          const msg =
            err.status === 404
              ? `No se encontró la reserva con código ${confirmationCode}.`
              : 'Error al buscar la reserva.';
          this._patch({ isLoading: false, error: msg });
          return throwError(() => err);
        })
      );
  }

  searchByGuestDocument(documentNumber: string): Observable<Reservation[]> {
    this._patch({ isLoading: true, error: null });
    return this.http
      .get<ReservationResponseDto[]>(`${this.apiUrl}/by-guest/${documentNumber}`)
      .pipe(
        map((dtos) => dtos.map(mapReservationDtoToDomain)),
        tap((results) => this._patch({ searchResults: results, isLoading: false })),
        catchError((err) => {
          this._patch({ isLoading: false, error: 'Error al buscar por huésped.' });
          return throwError(() => err);
        })
      );
  }

  /**
   * RN-26: Valida acompañantes declarados vs registrados.
   * Función pura — sin efectos secundarios, testeable de forma aislada.
   */
  validateCheckInCompanions(
    reservation: Reservation,
    companions: Companion[]
  ): CheckInValidationResult {
    const missing = Math.max(0, reservation.declaredCompanions - companions.length);
    const withoutDoc = companions
      .filter((c) => !c.documentNumber?.trim())
      .map((c) => `${c.firstName} ${c.lastName}`);

    return {
      isValid: missing === 0 && withoutDoc.length === 0,
      missingCompanions: missing,
      companionsWithoutDocument: withoutDoc,
    };
  }

  executeCheckIn(
    reservation: Reservation,
    companions: Companion[],
    staffId: string
  ): Observable<Reservation> {
    this._patch({ isProcessing: true, error: null });

    const dto: CheckInRequestDto = {
      reservation_id: reservation.id,
      companions: companions.map((c): CompanionDto => ({
        first_name: c.firstName,
        last_name: c.lastName,
        document_number: c.documentNumber,
        document_type: c.documentType,
      })),
      actual_check_in_time: new Date().toISOString(),
      staff_id: staffId,
    };

    return this.http
      .post<ReservationResponseDto>(`${this.apiUrl}/${reservation.id}/check-in`, dto)
      .pipe(
        map(mapReservationDtoToDomain),
        tap((updated) => this._patch({ activeReservation: updated, isProcessing: false })),
        catchError((err) => {
          this._patch({ isProcessing: false, error: 'Error al procesar el check-in.' });
          return throwError(() => err);
        })
      );
  }

  setActiveReservation(reservation: Reservation): void {
    this._patch({ activeReservation: reservation });
  }

  getActiveReservation(): Reservation | null {
    return this._state$.getValue().activeReservation;
  }

  clearState(): void {
    this._state$.next(INITIAL_STATE);
  }

  private _patch(patch: Partial<ReservationState>): void {
    this._state$.next({ ...this._state$.getValue(), ...patch });
  }
}

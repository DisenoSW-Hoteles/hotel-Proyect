// =============================================================================
// RESERVATION SERVICE
// Decisión Arquitectónica: Gestiona el estado de la reserva activa durante el
// proceso de Check-in. Contiene la validación de la RN-26 (regla de negocio
// sobre acompañantes) para mantenerla centralizada y reutilizable.
//
// Por qué en el servicio y no en el componente:
// - Un validador de formulario reactivo de Angular puede llamar a este servicio
// - Un test unitario puede validar la RN-26 sin instanciar ningún componente
// - Si la regla cambia, se modifica en un solo lugar
// =============================================================================

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
} from '../dtos';

export interface CheckInValidationResult {
  isValid: boolean;
  /** RN-26: Los acompañantes registrados deben igualar los declarados */
  missingCompanions: number;
  /** Todos los acompañantes deben tener documento de identidad */
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

  readonly state$: Observable<ReservationState> = this._state$.asObservable();

  readonly activeReservation$: Observable<Reservation | null> = this.state$.pipe(
    map((s) => s.activeReservation)
  );

  constructor(private readonly http: HttpClient) {}

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

  /**
   * RN-26: Valida que los acompañantes registrados coincidan con los declarados
   * y que todos tengan documento de identidad registrado.
   *
   * Esta función es PURA — no tiene efectos secundarios y puede ser invocada
   * tanto desde componentes como desde validadores de formulario reactivos.
   */
  validateCheckInCompanions(
    reservation: Reservation,
    companions: Companion[]
  ): CheckInValidationResult {
    const registeredCount = companions.length;
    const declaredCount = reservation.declaredCompanions;
    const missingCompanions = Math.max(0, declaredCount - registeredCount);

    // Verificar que todos los acompañantes tienen documento
    const companionsWithoutDocument = companions
      .filter((c) => !c.documentNumber || c.documentNumber.trim() === '')
      .map((c) => `${c.firstName} ${c.lastName}`);

    return {
      isValid: missingCompanions === 0 && companionsWithoutDocument.length === 0,
      missingCompanions,
      companionsWithoutDocument,
    };
  }

  /**
   * Ejecuta el check-in en el servidor.
   * Pre-condición: validateCheckInCompanions debe retornar isValid: true.
   * El componente es responsable de no llamar a este método si la validación falla.
   */
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

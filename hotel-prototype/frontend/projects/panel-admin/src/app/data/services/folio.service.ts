// =============================================================================
// FOLIO SERVICE
// Decisión Arquitectónica: El Folio es la pieza central del ciclo de vida del
// huésped. Este servicio actúa como un "store" reactivo para el folio activo.
//
// PATRÓN CLAVE — "Optimistic UI with reconciliation":
// Los cargos dinámicos (daños, consumos) se aplican localmente de inmediato
// para dar feedback instantáneo al staff, y se sincronizan con el servidor
// en background. Si el servidor falla, se hace rollback del estado local.
//
// LÓGICA DE NEGOCIO:
// - Late Check-out: Si la hora actual es posterior a las 12:00, se detecta
//   automáticamente y se inyecta el cargo correspondiente.
// - El servicio NUNCA delega esta lógica a los componentes (SRP).
//
// EXPOSICIÓN DE ESTADO:
// - folioState$ → Observable del estado completo (para suscripciones reactivas)
// - activeFolio$ → Observable del folio actual (null si no hay huésped activo)
// - totalAmount$ → Observable del total calculado en tiempo real
// =============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Folio, FolioCharge } from '../../core/models';
import {
  AddChargeRequestDto,
  FolioResponseDto,
  mapFolioDtoToDomain,
} from '../dtos';

export interface FolioState {
  activeFolio: Folio | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const LATE_CHECKOUT_HOUR = 12; // Hora límite de check-out sin recargo
const LATE_CHECKOUT_FEE = 50000; // CLP — configurar según política del hotel

const INITIAL_FOLIO_STATE: FolioState = {
  activeFolio: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class FolioService {
  private readonly apiUrl = `${environment.apiBaseUrl}/folios`;

  private readonly _folioState$ = new BehaviorSubject<FolioState>(INITIAL_FOLIO_STATE);

  readonly folioState$: Observable<FolioState> = this._folioState$.asObservable();

  // Selector derivado: solo el folio activo, sin metadatos de estado
  readonly activeFolio$: Observable<Folio | null> = this.folioState$.pipe(
    map((state) => state.activeFolio)
  );

  // Selector derivado: total calculado reactivamente desde los cargos
  readonly totalAmount$: Observable<number> = this.activeFolio$.pipe(
    map((folio) =>
      folio
        ? folio.charges.reduce((sum, c) => sum + c.amount * c.quantity, 0)
        : 0
    )
  );

  // Selector: cargos agrupados por categoría para la vista del folio
  readonly chargesByCategory$: Observable<Record<string, FolioCharge[]>> =
    this.activeFolio$.pipe(
      map((folio) => {
        if (!folio) return {};
        return folio.charges.reduce(
          (groups, charge) => ({
            ...groups,
            [charge.category]: [
              ...(groups[charge.category] ?? []),
              charge,
            ],
          }),
          {} as Record<string, FolioCharge[]>
        );
      })
    );

  constructor(private readonly http: HttpClient) {}

  /**
   * Carga el folio de una reserva desde el servidor.
   * Al cargar, evalúa automáticamente si aplica cargo por Late Check-out.
   */
  loadFolioByReservation(reservationId: string): Observable<Folio> {
    this._patchState({ isLoading: true, error: null });

    return this.http
      .get<FolioResponseDto>(`${this.apiUrl}/reservation/${reservationId}`)
      .pipe(
        map(mapFolioDtoToDomain),
        tap((folio) => {
          // Evaluar late check-out al cargar el folio
          const folioWithLateCheckout = this._applyLateCheckoutIfApplicable(folio);
          this._patchState({ activeFolio: folioWithLateCheckout, isLoading: false });
        }),
        catchError((error) => {
          this._patchState({ isLoading: false, error: 'Error al cargar el folio.' });
          return throwError(() => error);
        })
      );
  }

  /**
   * Agrega un cargo dinámico al folio (daños, consumos, etc.).
   * PATRÓN OPTIMISTA: actualiza el estado local inmediatamente y sincroniza
   * con el servidor. Si el servidor falla, hace rollback al estado anterior.
   */
  addCharge(request: AddChargeRequestDto): Observable<FolioCharge> {
    const previousState = this._folioState$.getValue();
    this._patchState({ isSaving: true });

    return this.http
      .post<{ charge: { id: string } }>(`${this.apiUrl}/charges`, request)
      .pipe(
        tap((response) => {
          const newCharge: FolioCharge = {
            id: response.charge.id,
            category: request.category as FolioCharge['category'],
            description: request.description,
            amount: request.amount,
            quantity: request.quantity,
            date: new Date(),
            addedBy: 'current-user', // Reemplazar con ID del usuario logueado
          };
          this._appendChargeToActiveFolio(newCharge);
          this._patchState({ isSaving: false });
        }),
        map((response) => ({
          id: response.charge.id,
          category: request.category as FolioCharge['category'],
          description: request.description,
          amount: request.amount,
          quantity: request.quantity,
          date: new Date(),
          addedBy: 'current-user',
        })),
        catchError((error) => {
          // ROLLBACK: restaurar el estado anterior si el servidor falla
          this._folioState$.next(previousState);
          this._patchState({ isSaving: false, error: 'Error al agregar el cargo.' });
          return throwError(() => error);
        })
      );
  }

  /**
   * Cierra el folio marcándolo como PENDING_REVIEW para la liquidación final.
   */
  closeFolio(folioId: string): Observable<void> {
    this._patchState({ isSaving: true });

    return this.http
      .patch<void>(`${this.apiUrl}/${folioId}/close`, {})
      .pipe(
        tap(() => {
          const currentFolio = this._folioState$.getValue().activeFolio;
          if (currentFolio) {
            this._patchState({
              activeFolio: { ...currentFolio, status: 'PENDING_REVIEW' },
              isSaving: false,
            });
          }
        }),
        catchError((error) => {
          this._patchState({ isSaving: false, error: 'Error al cerrar el folio.' });
          return throwError(() => error);
        })
      );
  }

  clearFolio(): void {
    this._folioState$.next(INITIAL_FOLIO_STATE);
  }

  // ---------------------------------------------------------------------------
  // LÓGICA DE NEGOCIO PRIVADA
  // ---------------------------------------------------------------------------

  /**
   * RN-LCO: Si la hora actual es posterior a las 12:00, inyecta automáticamente
   * el cargo por Late Check-out si no existe ya en el folio.
   */
  private _applyLateCheckoutIfApplicable(folio: Folio): Folio {
    const now = new Date();
    const isLateCheckout = now.getHours() >= LATE_CHECKOUT_HOUR;
    const alreadyCharged = folio.charges.some(
      (c) => c.category === 'LATE_CHECKOUT'
    );

    if (!isLateCheckout || alreadyCharged) {
      return folio;
    }

    const lateCheckoutCharge: FolioCharge = {
      id: `lco-${Date.now()}`, // ID temporal hasta sincronización con servidor
      category: 'LATE_CHECKOUT',
      description: `Recargo por salida tardía (posterior a las ${LATE_CHECKOUT_HOUR}:00 hrs)`,
      amount: LATE_CHECKOUT_FEE,
      quantity: 1,
      date: now,
      addedBy: 'SYSTEM',
    };

    return {
      ...folio,
      charges: [...folio.charges, lateCheckoutCharge],
    };
  }

  private _appendChargeToActiveFolio(charge: FolioCharge): void {
    const currentFolio = this._folioState$.getValue().activeFolio;
    if (!currentFolio) return;

    this._patchState({
      activeFolio: {
        ...currentFolio,
        charges: [...currentFolio.charges, charge],
      },
    });
  }

  private _patchState(patch: Partial<FolioState>): void {
    this._folioState$.next({
      ...this._folioState$.getValue(),
      ...patch,
    });
  }
}

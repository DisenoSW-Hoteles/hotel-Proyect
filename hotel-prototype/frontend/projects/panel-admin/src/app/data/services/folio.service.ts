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
} from '../models';

export interface FolioState {
  activeFolio: Folio | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const LATE_CHECKOUT_HOUR = 12;
const LATE_CHECKOUT_FEE = 50000;

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

  readonly folioState$ = this._folioState$.asObservable();
  readonly activeFolio$ = this.folioState$.pipe(map((state) => state.activeFolio));
  readonly totalAmount$ = this.activeFolio$.pipe(
    map((folio) =>
      folio ? folio.charges.reduce((sum, c) => sum + c.amount * c.quantity, 0) : 0
    )
  );
  readonly chargesByCategory$ = this.activeFolio$.pipe(
    map((folio) => {
      if (!folio) return {};
      return folio.charges.reduce(
        (groups, charge) => ({
          ...groups,
          [charge.category]: [...(groups[charge.category] ?? []), charge],
        }),
        {} as Record<string, FolioCharge[]>
      );
    })
  );

  constructor(private readonly http: HttpClient) {}

  getCurrentFolio(): Folio | null {
    return this._folioState$.getValue().activeFolio;
  }

  loadFolioByReservation(reservationId: string): Observable<Folio> {
    this._patchState({ isLoading: true, error: null });

    return this.http
      .get<FolioResponseDto>(`${this.apiUrl}/reservation/${reservationId}`)
      .pipe(
        map(mapFolioDtoToDomain),
        tap((folio) => {
          const folioWithLateCheckout = this._applyLateCheckoutIfApplicable(folio);
          this._patchState({ activeFolio: folioWithLateCheckout, isLoading: false });
        }),
        catchError((error) => {
          this._patchState({ isLoading: false, error: 'Error al cargar el folio.' });
          return throwError(() => error);
        })
      );
  }

  addCharge(request: AddChargeRequestDto): Observable<FolioCharge> {
    const previousState = this._folioState$.getValue();
    this._patchState({ isSaving: true });

    return this.http
      .post<{ charge: { id: string } }>(`${this.apiUrl}/charges`, request)
      .pipe(
        map((response): FolioCharge => ({
          id: response.charge.id,
          category: request.category,
          description: request.description,
          amount: request.amount,
          quantity: request.quantity,
          date: new Date(),
          addedBy: 'current-user',
        })),
        tap((newCharge) => {
          this._appendChargeToActiveFolio(newCharge);
          this._patchState({ isSaving: false });
        }),
        catchError((error) => {
          this._folioState$.next({
            ...previousState,
            error: 'Error al agregar el cargo.',
          });
          return throwError(() => error);
        })
      );
  }

  closeFolio(folioId: string): Observable<void> {
    this._patchState({ isSaving: true });

    return this.http.patch<void>(`${this.apiUrl}/${folioId}/close`, {}).pipe(
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

  private _applyLateCheckoutIfApplicable(folio: Folio): Folio {
    const now = new Date();
    const isLateCheckout = now.getHours() >= LATE_CHECKOUT_HOUR;

    if (!isLateCheckout) {
      return folio;
    }

    const hasLatePenalty = folio.charges.some(
      (charge) => charge.category === 'LATE_CHECKOUT'
    );

    if (hasLatePenalty) {
      return folio;
    }

    const lateCharge: FolioCharge = {
      id: `late-${Date.now()}`,
      category: 'LATE_CHECKOUT',
      description: 'Recargo por salida tardía',
      amount: LATE_CHECKOUT_FEE,
      quantity: 1,
      date: now,
      addedBy: 'system',
    };

    return {
      ...folio,
      charges: [...folio.charges, lateCharge],
    };
  }

  private _patchState(patch: Partial<FolioState>): void {
    this._folioState$.next({ ...this._folioState$.getValue(), ...patch });
  }
}

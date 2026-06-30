import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Folio,
  FolioCharge,
  AddChargeRequestDto,
  FolioResponseDto,
  mapFolioDtoToDomain,
} from '../models';

export interface CheckOutState {
  activeFolio: Folio | null;
  isSearching: boolean;
  isSaving: boolean;
  error: string | null;
}

const LATE_CHECKOUT_HOUR = 12;
const LATE_CHECKOUT_FEE = 50_000; // CLP

const INITIAL_STATE: CheckOutState = {
  activeFolio: null,
  isSearching: false,
  isSaving: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class CheckOutService {
  // Endpoints administrativos — distintos del portal-cliente
  private readonly reservationsUrl = `${environment.apiBaseUrl}/admin/reservations`;
  private readonly foliosUrl = `${environment.apiBaseUrl}/admin/folios`;

  private readonly _state$ = new BehaviorSubject<CheckOutState>(INITIAL_STATE);

  readonly state$: Observable<CheckOutState> = this._state$.asObservable();

  readonly activeFolio$: Observable<Folio | null> = this._state$.pipe(
    map((s) => s.activeFolio)
  );

  readonly totalAmount$: Observable<number> = this.activeFolio$.pipe(
    map((folio) =>
      folio ? folio.charges.reduce((sum, c) => sum + c.amount * c.quantity, 0) : 0
    )
  );

  readonly chargesByCategory$: Observable<Record<string, FolioCharge[]>> =
    this.activeFolio$.pipe(
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

  /**
   * Busca la reserva por código y carga su folio en un solo paso.
   * El componente no necesita orquestar dos llamadas separadas.
   */
  searchAndLoadFolio(confirmationCode: string): Observable<Folio> {
    this._patch({ isSearching: true, error: null });

    return this.http
      .get<{ id: string }>(`${this.reservationsUrl}/by-code/${confirmationCode}`)
      .pipe(
        switchMap((res) =>
          this.http.get<FolioResponseDto>(`${this.foliosUrl}/reservation/${res.id}`)
        ),
        map(mapFolioDtoToDomain),
        map((folio) => this._applyLateCheckoutIfNeeded(folio)),
        tap((folio) => this._patch({ activeFolio: folio, isSearching: false })),
        catchError((err) => {
          const msg =
            err.status === 404
              ? 'No se encontró la reserva o el folio.'
              : 'Error al buscar la reserva.';
          this._patch({ isSearching: false, error: msg });
          return throwError(() => err);
        })
      );
  }

  /**
   * Optimistic UI: aplica el cargo localmente de inmediato y sincroniza en background.
   * Si el servidor falla, hace rollback al estado anterior.
   */
  addCharge(request: AddChargeRequestDto): Observable<FolioCharge> {
    const snapshot = this._state$.getValue();
    this._patch({ isSaving: true });

    return this.http
      .post<{ charge: { id: string } }>(`${this.foliosUrl}/charges`, request)
      .pipe(
        tap((res) => {
          const newCharge: FolioCharge = {
            id: res.charge.id,
            category: request.category as FolioCharge['category'],
            description: request.description,
            amount: request.amount,
            quantity: request.quantity,
            date: new Date(),
            addedBy: 'current-user',
          };
          this._appendCharge(newCharge);
          this._patch({ isSaving: false });
        }),
        map((res) => ({
          id: res.charge.id,
          category: request.category as FolioCharge['category'],
          description: request.description,
          amount: request.amount,
          quantity: request.quantity,
          date: new Date(),
          addedBy: 'current-user',
        })),
        catchError((err) => {
          this._state$.next(snapshot); // rollback
          this._patch({ isSaving: false, error: 'Error al agregar el cargo.' });
          return throwError(() => err);
        })
      );
  }

  closeFolio(folioId: string): Observable<void> {
    this._patch({ isSaving: true });
    return this.http.patch<void>(`${this.foliosUrl}/${folioId}/close`, {}).pipe(
      tap(() => {
        const folio = this._state$.getValue().activeFolio;
        if (folio) this._patch({ activeFolio: { ...folio, status: 'PENDING_REVIEW' }, isSaving: false });
      }),
      catchError((err) => {
        this._patch({ isSaving: false, error: 'Error al cerrar el folio.' });
        return throwError(() => err);
      })
    );
  }

  getActiveFolioId(): string | null {
    return this._state$.getValue().activeFolio?.id ?? null;
  }

  clearFolio(): void {
    this._state$.next(INITIAL_STATE);
  }

  private _applyLateCheckoutIfNeeded(folio: Folio): Folio {
    const isLate = new Date().getHours() >= LATE_CHECKOUT_HOUR;
    const alreadyCharged = folio.charges.some((c) => c.category === 'LATE_CHECKOUT');
    if (!isLate || alreadyCharged) return folio;

    return {
      ...folio,
      charges: [
        ...folio.charges,
        {
          id: `lco-${Date.now()}`,
          category: 'LATE_CHECKOUT',
          description: `Recargo por salida tardía (posterior a las ${LATE_CHECKOUT_HOUR}:00 hrs)`,
          amount: LATE_CHECKOUT_FEE,
          quantity: 1,
          date: new Date(),
          addedBy: 'SYSTEM',
        },
      ],
    };
  }

  private _appendCharge(charge: FolioCharge): void {
    const folio = this._state$.getValue().activeFolio;
    if (folio) this._patch({ activeFolio: { ...folio, charges: [...folio.charges, charge] } });
  }

  private _patch(patch: Partial<CheckOutState>): void {
    this._state$.next({ ...this._state$.getValue(), ...patch });
  }
}

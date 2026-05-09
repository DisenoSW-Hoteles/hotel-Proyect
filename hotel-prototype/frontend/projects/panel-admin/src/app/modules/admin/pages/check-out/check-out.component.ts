import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FolioService } from '../../../../data/services/folio.service';
import { ReservationService } from '../../../../data/services/reservation.service';
import { AuthService } from '../../../../data/services/auth.service';
import { ChargeCategory } from '../../../../core/models';
import { AddChargeRequestDto } from '../../../../data/dtos';

@Component({
  standalone: true,
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CheckOutComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly folioService = inject(FolioService);
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);

  private readonly _destroy$ = new Subject<void>();

  currentStep: 'SEARCH' | 'FOLIO' | 'PAYMENT' | 'SUCCESS' = 'SEARCH';
  searchForm!: FormGroup;
  addChargeForm!: FormGroup;
  paymentForm!: FormGroup;
  showAddChargePanel = false;

  readonly folioState$ = this.folioService.folioState$;
  readonly activeFolio$ = this.folioService.activeFolio$;
  readonly totalAmount$ = this.folioService.totalAmount$;
  readonly chargesByCategory$ = this.folioService.chargesByCategory$;
  readonly reservationState$ = this.reservationService.state$;

  readonly chargeCategories: { value: ChargeCategory; label: string }[] = [
    { value: 'DAMAGE', label: '🔧 Multa por Daños' },
    { value: 'MINIBAR', label: '🍺 Consumo Minibar' },
    { value: 'RESTAURANT', label: '🍽️ Restaurante / Cafetería' },
    { value: 'LAUNDRY', label: '👕 Lavandería' },
    { value: 'PARKING', label: '🚗 Estacionamiento' },
    { value: 'OTHER', label: '📋 Otro Cargo' },
  ];

  readonly paymentMethods = [
    { value: 'CREDIT_CARD', label: '💳 Tarjeta de Crédito' },
    { value: 'DEBIT_CARD', label: '💳 Tarjeta de Débito (Redcompra)' },
    { value: 'CASH', label: '💵 Efectivo' },
    { value: 'TRANSFER', label: '🏦 Transferencia Bancaria' },
  ];

  ngOnInit(): void {
    this._buildForms();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.folioService.clearFolio();
  }

  onSearchReservation(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const { code } = this.searchForm.value;

    this.reservationService
      .searchByCode(code)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (reservation) => {
          this.folioService
            .loadFolioByReservation(reservation.id)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
              next: () => (this.currentStep = 'FOLIO'),
            });
        },
      });
  }

  onAddCharge(): void {
    if (this.addChargeForm.invalid) {
      this.addChargeForm.markAllAsTouched();
      return;
    }

    const folioId = this.folioService['_folioState$'].getValue().activeFolio?.id;
    if (!folioId) return;

    const { category, description, amount, quantity } = this.addChargeForm.value;

    const request: AddChargeRequestDto = {
      folio_id: folioId,
      category,
      description,
      amount: Math.round(amount),
      quantity,
    };

    this.folioService
      .addCharge(request)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.addChargeForm.reset({ quantity: 1 });
          this.showAddChargePanel = false;
        },
      });
  }

  onProceedToPayment(): void {
    const folio = this.folioService['_folioState$'].getValue().activeFolio;
    if (!folio) return;

    this.folioService
      .closeFolio(folio.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => (this.currentStep = 'PAYMENT'),
      });
  }

  onConfirmPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.currentStep = 'SUCCESS';
  }

  getCategoryLabel(category: string): string {
    return (
      this.chargeCategories.find((c) => c.value === category)?.label ?? category
    );
  }

  private _buildForms(): void {
    this.searchForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.addChargeForm = this.fb.group({
      category: ['DAMAGE', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['CREDIT_CARD', Validators.required],
      observations: [''],
    });
  }
}

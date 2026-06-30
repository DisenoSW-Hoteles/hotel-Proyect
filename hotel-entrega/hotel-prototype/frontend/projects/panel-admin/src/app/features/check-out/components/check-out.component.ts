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
import { CheckOutService } from '../services/check-out.service';
import { AddChargeRequestDto, ChargeCategory } from '../models';

@Component({
  standalone: true,
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CheckOutComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly checkOutService = inject(CheckOutService);

  private readonly _destroy$ = new Subject<void>();

  currentStep: 'SEARCH' | 'FOLIO' | 'PAYMENT' | 'SUCCESS' = 'SEARCH';
  searchForm!: FormGroup;
  addChargeForm!: FormGroup;
  paymentForm!: FormGroup;
  showAddChargePanel = false;

  readonly checkOutState$ = this.checkOutService.state$;
  readonly activeFolio$ = this.checkOutService.activeFolio$;
  readonly totalAmount$ = this.checkOutService.totalAmount$;
  readonly chargesByCategory$ = this.checkOutService.chargesByCategory$;

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
    this.checkOutService.clearFolio();
  }

  onSearchReservation(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    this.checkOutService
      .searchAndLoadFolio(this.searchForm.value.code)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => (this.currentStep = 'FOLIO') });
  }

  onAddCharge(): void {
    if (this.addChargeForm.invalid) {
      this.addChargeForm.markAllAsTouched();
      return;
    }
    const folioId = this.checkOutService.getActiveFolioId();
    if (!folioId) return;

    const { category, description, amount, quantity } = this.addChargeForm.value;
    const request: AddChargeRequestDto = {
      folio_id: folioId,
      category,
      description,
      amount: Math.round(amount),
      quantity,
    };

    this.checkOutService
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
    const folioId = this.checkOutService.getActiveFolioId();
    if (!folioId) return;
    this.checkOutService
      .closeFolio(folioId)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => (this.currentStep = 'PAYMENT') });
  }

  onConfirmPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.currentStep = 'SUCCESS';
  }

  getCategoryLabel(category: string): string {
    return this.chargeCategories.find((c) => c.value === category)?.label ?? category;
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

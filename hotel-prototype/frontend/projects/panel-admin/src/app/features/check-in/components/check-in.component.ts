import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CheckInService, CheckInValidationResult } from '../services/check-in.service';
import { AuthService } from '../../../core/services/auth.service';
import { Companion, Reservation } from '../models';

function rutValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const rut = control.value.toString().replace(/\./g, '').replace(/-/g, '');
  if (rut.length < 8) return { invalidRut: true };
  const body = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expected =
    11 - (sum % 11) === 11 ? '0' : 11 - (sum % 11) === 10 ? 'K' : (11 - (sum % 11)).toString();
  return dv === expected ? null : { invalidRut: true };
}

@Component({
  standalone: true,
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CheckInComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly checkInService = inject(CheckInService);
  private readonly authService = inject(AuthService);

  private readonly _destroy$ = new Subject<void>();

  searchForm!: FormGroup;
  checkInForm!: FormGroup;

  currentStep: 'SEARCH' | 'COMPANIONS' | 'CONFIRM' | 'SUCCESS' = 'SEARCH';
  searchType: 'CODE' | 'DOCUMENT' = 'CODE';

  readonly reservationState$ = this.checkInService.state$;
  readonly activeReservation$ = this.checkInService.activeReservation$;

  rn26ValidationResult: CheckInValidationResult | null = null;

  ngOnInit(): void {
    this._buildSearchForm();
    this._buildCheckInForm();
    this._subscribeToCompanionChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.checkInService.clearState();
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const { searchType, searchValue } = this.searchForm.value;
    if (searchType === 'CODE') {
      this.checkInService
        .searchByCode(searchValue)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (reservation) => {
            this._prepareCompanionsForm(reservation);
            this.currentStep = 'COMPANIONS';
          },
        });
    } else {
      this.checkInService
        .searchByGuestDocument(searchValue)
        .pipe(takeUntil(this._destroy$))
        .subscribe();
    }
  }

  onSelectReservation(reservation: Reservation): void {
    this.checkInService.setActiveReservation(reservation);
    this._prepareCompanionsForm(reservation);
    this.currentStep = 'COMPANIONS';
  }

  get companionsArray(): FormArray {
    return this.checkInForm.get('companions') as FormArray;
  }

  addCompanionForm(): void {
    this.companionsArray.push(this._createCompanionGroup());
    this._validateRn26();
  }

  removeCompanion(index: number): void {
    this.companionsArray.removeAt(index);
    this._validateRn26();
  }

  onDocumentTypeChange(index: number): void {
    const group = this.companionsArray.at(index) as FormGroup;
    const docCtrl = group.get('documentNumber');
    const type = group.get('documentType')?.value;
    docCtrl?.setValidators(
      type === 'RUT'
        ? [Validators.required, rutValidator]
        : [Validators.required, Validators.minLength(6), Validators.maxLength(20)]
    );
    docCtrl?.updateValueAndValidity();
  }

  onProceedToConfirm(): void {
    if (this.checkInForm.invalid) {
      this.checkInForm.markAllAsTouched();
      return;
    }
    const active = this.checkInService.getActiveReservation();
    if (!active) return;

    const companions = this._buildCompanions();
    this.rn26ValidationResult = this.checkInService.validateCheckInCompanions(active, companions);
    if (this.rn26ValidationResult.isValid) this.currentStep = 'CONFIRM';
  }

  onConfirmCheckIn(): void {
    const active = this.checkInService.getActiveReservation();
    const user = this.authService.getCurrentUser();
    if (!active || !user) return;

    this.checkInService
      .executeCheckIn(active, this._buildCompanions(), user.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => (this.currentStep = 'SUCCESS') });
  }

  onStartNewCheckIn(): void {
    this.currentStep = 'SEARCH';
    this.searchForm.reset({ searchType: 'CODE' });
    this.checkInForm.reset();
    while (this.companionsArray.length) this.companionsArray.removeAt(0);
    this.rn26ValidationResult = null;
    this.checkInService.clearState();
  }

  private _buildSearchForm(): void {
    this.searchForm = this.fb.group({
      searchType: ['CODE'],
      searchValue: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  private _buildCheckInForm(): void {
    this.checkInForm = this.fb.group({ companions: this.fb.array([]) });
  }

  private _createCompanionGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      documentType: ['RUT', Validators.required],
      documentNumber: ['', [Validators.required, rutValidator]],
    });
  }

  private _prepareCompanionsForm(reservation: Reservation): void {
    while (this.companionsArray.length) this.companionsArray.removeAt(0);
    reservation.registeredCompanions?.forEach((c) => {
      const g = this._createCompanionGroup();
      g.patchValue({ firstName: c.firstName, lastName: c.lastName, documentType: c.documentType, documentNumber: c.documentNumber });
      this.companionsArray.push(g);
    });
    const remaining = reservation.declaredCompanions - this.companionsArray.length;
    for (let i = 0; i < remaining; i++) this.companionsArray.push(this._createCompanionGroup());
  }

  private _subscribeToCompanionChanges(): void {
    this.companionsArray.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe(() => this._validateRn26());
  }

  private _validateRn26(): void {
    const active = this.checkInService.getActiveReservation();
    if (!active) return;
    this.rn26ValidationResult = this.checkInService.validateCheckInCompanions(
      active,
      this._buildCompanions()
    );
  }

  private _buildCompanions(): Companion[] {
    return this.companionsArray.value.map(
      (v: { firstName: string; lastName: string; documentType: 'RUT' | 'PASSPORT'; documentNumber: string }): Companion => ({
        firstName: v.firstName,
        lastName: v.lastName,
        documentType: v.documentType,
        documentNumber: v.documentNumber,
      })
    );
  }
}

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
import { ReservationService } from '../../../../data/services/reservation.service';
import { AuthService } from '../../../../data/services/auth.service';
import { Companion, Reservation } from '../../../../core/models';

// Validador de RUT chileno (formato: 12345678-9)
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
  const expectedDv =
    11 - (sum % 11) === 11
      ? '0'
      : 11 - (sum % 11) === 10
      ? 'K'
      : (11 - (sum % 11)).toString();
  return dv === expectedDv ? null : { invalidRut: true };
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
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);

  private readonly _destroy$ = new Subject<void>();

  searchForm!: FormGroup;
  checkInForm!: FormGroup;

  currentStep: 'SEARCH' | 'COMPANIONS' | 'CONFIRM' | 'SUCCESS' = 'SEARCH';
  searchType: 'CODE' | 'DOCUMENT' = 'CODE';

  readonly reservationState$ = this.reservationService.state$;
  readonly activeReservation$ = this.reservationService.activeReservation$;

  rn26ValidationResult: {
    isValid: boolean;
    missingCompanions: number;
    companionsWithoutDocument: string[];
  } | null = null;

  ngOnInit(): void {
    this._buildSearchForm();
    this._buildCheckInForm();
    this._subscribeToReservationChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.reservationService.clearState();
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const { searchType, searchValue } = this.searchForm.value;

    if (searchType === 'CODE') {
      this.reservationService
        .searchByCode(searchValue)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (reservation) => {
            this._prepareCompanionsForm(reservation);
            this.currentStep = 'COMPANIONS';
          },
        });
    } else {
      this.reservationService
        .searchByGuestDocument(searchValue)
        .pipe(takeUntil(this._destroy$))
        .subscribe();
    }
  }

  onSelectReservation(reservation: Reservation): void {
    this.reservationService.setActiveReservation(reservation);
    this._prepareCompanionsForm(reservation);
    this.currentStep = 'COMPANIONS';
  }

  get companionsArray(): FormArray {
    return this.checkInForm.get('companions') as FormArray;
  }

  addCompanionForm(): void {
    const companionGroup = this._createCompanionFormGroup();
    this.companionsArray.push(companionGroup);
    this._validateRn26();
  }

  removeCompanion(index: number): void {
    this.companionsArray.removeAt(index);
    this._validateRn26();
  }

  onDocumentTypeChange(index: number): void {
    const companionGroup = this.companionsArray.at(index) as FormGroup;
    const documentType = companionGroup.get('documentType')?.value;

    const documentControl = companionGroup.get('documentNumber');
    if (documentType === 'RUT') {
      documentControl?.setValidators([Validators.required, rutValidator]);
    } else {
      documentControl?.setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]);
    }
    documentControl?.updateValueAndValidity();
  }

  onProceedToConfirm(): void {
    if (this.checkInForm.invalid) {
      this.checkInForm.markAllAsTouched();
      return;
    }

    const activeReservation = this.reservationService['_state$'].getValue().activeReservation;
    if (!activeReservation) return;

    const companions = this._buildCompanionsFromForm();
    this.rn26ValidationResult = this.reservationService.validateCheckInCompanions(
      activeReservation,
      companions
    );

    if (this.rn26ValidationResult.isValid) {
      this.currentStep = 'CONFIRM';
    }
  }

  onConfirmCheckIn(): void {
    const currentUser = this.authService.getCurrentUser();
    const activeReservation = this.reservationService['_state$'].getValue().activeReservation;

    if (!activeReservation || !currentUser) return;

    const companions = this._buildCompanionsFromForm();

    this.reservationService
      .executeCheckIn(activeReservation, companions, currentUser.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.currentStep = 'SUCCESS';
        },
      });
  }

  onStartNewCheckIn(): void {
    this.currentStep = 'SEARCH';
    this.searchForm.reset({ searchType: 'CODE' });
    this.checkInForm.reset();
    while (this.companionsArray.length) {
      this.companionsArray.removeAt(0);
    }
    this.rn26ValidationResult = null;
    this.reservationService.clearState();
  }

  private _buildSearchForm(): void {
    this.searchForm = this.fb.group({
      searchType: ['CODE'],
      searchValue: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  private _buildCheckInForm(): void {
    this.checkInForm = this.fb.group({
      companions: this.fb.array([]),
    });
  }

  private _createCompanionFormGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      documentType: ['RUT', Validators.required],
      documentNumber: ['', [Validators.required, rutValidator]],
    });
  }

  private _prepareCompanionsForm(reservation: Reservation): void {
    while (this.companionsArray.length) {
      this.companionsArray.removeAt(0);
    }

    if (reservation.registeredCompanions?.length) {
      reservation.registeredCompanions.forEach((companion) => {
        const group = this._createCompanionFormGroup();
        group.patchValue({
          firstName: companion.firstName,
          lastName: companion.lastName,
          documentType: companion.documentType,
          documentNumber: companion.documentNumber,
        });
        this.companionsArray.push(group);
      });
    }

    const remaining = reservation.declaredCompanions - this.companionsArray.length;
    for (let i = 0; i < remaining; i++) {
      this.companionsArray.push(this._createCompanionFormGroup());
    }
  }

  private _subscribeToReservationChanges(): void {
    this.companionsArray.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._validateRn26());
  }

  private _validateRn26(): void {
    const activeReservation =
      this.reservationService['_state$'].getValue().activeReservation;
    if (!activeReservation) return;

    const companions = this._buildCompanionsFromForm();
    this.rn26ValidationResult = this.reservationService.validateCheckInCompanions(
      activeReservation,
      companions
    );
  }

  private _buildCompanionsFromForm(): Companion[] {
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

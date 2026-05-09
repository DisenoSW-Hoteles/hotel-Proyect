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
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomsService } from '../services/rooms.service';
import { Room, UpdateRoomRateDto } from '../models';

function clpMultipleValidator(control: AbstractControl) {
  const value = control.value;
  if (value && value % 1000 !== 0) return { notMultipleOf1000: true };
  return null;
}

@Component({
  standalone: true,
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RoomsComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly roomsService = inject(RoomsService);

  private readonly _destroy$ = new Subject<void>();

  readonly roomState$ = this.roomsService.state$;
  readonly rooms$ = this.roomsService.rooms$;

  rateForm!: FormGroup;
  filterForm!: FormGroup;
  showRateModal = false;
  editingRoom: Room | null = null;

  readonly branches = [
    { value: '', label: 'Todas las sucursales' },
    { value: 'TEMUCO', label: 'Temuco' },
    { value: 'PUCON', label: 'Pucón' },
    { value: 'SANTIAGO', label: 'Santiago' },
    { value: 'VINA_DEL_MAR', label: 'Viña del Mar' },
  ];

  ngOnInit(): void {
    this._buildForms();
    this.roomsService.loadRooms().pipe(takeUntil(this._destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onFilterChange(): void {
    const { branch } = this.filterForm.value;
    this.roomsService.loadRooms(branch || undefined).pipe(takeUntil(this._destroy$)).subscribe();
  }

  openRateModal(room: Room): void {
    this.editingRoom = room;
    this.rateForm.patchValue({
      baseRate: room.baseRate,
      effectiveFrom: new Date().toISOString().split('T')[0],
      reason: '',
    });
    this.showRateModal = true;
  }

  onSaveRate(): void {
    if (this.rateForm.invalid || !this.editingRoom) {
      this.rateForm.markAllAsTouched();
      return;
    }
    const { baseRate, effectiveFrom, reason } = this.rateForm.value;
    const dto: UpdateRoomRateDto = {
      room_id: this.editingRoom.id,
      base_rate: baseRate,
      effective_from: new Date(effectiveFrom).toISOString(),
      reason,
    };
    this.roomsService
      .updateBaseRate(dto)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => this.closeModal() });
  }

  closeModal(): void {
    this.showRateModal = false;
    this.editingRoom = null;
  }

  getRoomStatusClass(status: string): string {
    const map: Record<string, string> = {
      AVAILABLE: 'status--available',
      OCCUPIED: 'status--occupied',
      MAINTENANCE: 'status--maintenance',
      CLEANING: 'status--cleaning',
    };
    return map[status] ?? '';
  }

  private _buildForms(): void {
    this.filterForm = this.fb.group({ branch: [''] });
    this.rateForm = this.fb.group({
      baseRate: [null, [Validators.required, Validators.min(1000), Validators.max(5_000_000), clpMultipleValidator]],
      effectiveFrom: [new Date().toISOString().split('T')[0], Validators.required],
      reason: ['', Validators.maxLength(200)],
    });
  }
}

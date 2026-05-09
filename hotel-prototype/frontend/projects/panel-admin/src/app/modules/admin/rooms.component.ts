import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomService } from '../../data/services/room.service';
import { Room } from '../../core/models';
import { clpMultipleOf1000Validator } from '../../shared/validators';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  private readonly _destroy$ = new Subject<void>();

  readonly roomState$ = this.roomService.state$;
  readonly rooms$ = this.roomService.rooms$;
  readonly selectedRoom$ = this.roomService.selectedRoom$;

  rateForm!: FormGroup;
  filterForm!: FormGroup;
  showRateModal = false;
  editingRoom: Room | null = null;

  readonly roomTypes = ['STANDARD', 'SUPERIOR', 'DELUXE', 'SUITE', 'PREMIUM_SUITE'];
  readonly branches = [
    { value: '', label: 'Todas las sucursales' },
    { value: 'TEMUCO', label: 'Temuco' },
    { value: 'PUCON', label: 'Pucón' },
    { value: 'SANTIAGO', label: 'Santiago' },
    { value: 'VINA_DEL_MAR', label: 'Viña del Mar' },
  ];

  ngOnInit(): void {
    this._buildForms();
    this.roomService.loadRooms().pipe(takeUntil(this._destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onFilterChange(): void {
    const { branch } = this.filterForm.value;
    this.roomService
      .loadRooms(branch || undefined)
      .pipe(takeUntil(this._destroy$))
      .subscribe();
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

    this.roomService
      .updateBaseRate({
        room_id: this.editingRoom.id,
        base_rate: baseRate,
        effective_from: new Date(effectiveFrom).toISOString(),
        reason,
      })
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => this.closeModal(),
      });
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
    this.filterForm = this.fb.group({
      branch: [''],
      roomType: [''],
    });

    this.rateForm = this.fb.group({
      baseRate: [
        null,
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(5000000),
          clpMultipleOf1000Validator,
        ],
      ],
      effectiveFrom: [new Date().toISOString().split('T')[0], Validators.required],
      reason: ['', Validators.maxLength(200)],
    });
  }
}

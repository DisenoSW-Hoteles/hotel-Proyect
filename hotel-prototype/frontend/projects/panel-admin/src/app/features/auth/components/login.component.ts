import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _destroy$ = new Subject<void>();
  private _returnUrl = '/admin/front-desk/check-in';

  loginForm!: FormGroup;
  showPassword = false;

  readonly authState$ = this.authService.authState$;

  ngOnInit(): void {
    this._returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin/front-desk/check-in';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    this.authService.isAuthenticated$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isAuth) => {
        if (isAuth) this.router.navigateByUrl(this._returnUrl);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password, rememberMe } = this.loginForm.value;
    this.authService
      .login({ email, password }, rememberMe)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: () => this.router.navigateByUrl(this._returnUrl) });
  }

  onDemoLogin(): void {
    this.authService.loginDemo();
    this.router.navigateByUrl(this._returnUrl);
  }

  getFieldError(fieldName: string): string | null {
    const control = this.loginForm.get(fieldName);
    if (!control?.invalid || !control?.touched) return null;
    if (control.errors?.['required']) return 'Este campo es requerido.';
    if (control.errors?.['email']) return 'Ingrese un email válido.';
    if (control.errors?.['minlength'])
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
    return 'Valor inválido.';
  }
}

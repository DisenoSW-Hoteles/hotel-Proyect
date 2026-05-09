import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { APP_ROUTES } from '../../shared/constants/app-routes';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly _destroy$ = new Subject<void>();

  private _returnUrl: string = APP_ROUTES.ADMIN_CHECK_IN;

  loginForm!: FormGroup;
  showPassword = false;

  readonly authState$ = this.authService.authState$;

  ngOnInit(): void {
    this._returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ??
      APP_ROUTES.ADMIN_CHECK_IN;

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });

    this.authService.isAuthenticated$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isAuth) => {
        if (isAuth) {
          this.router.navigateByUrl(this._returnUrl);
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onLoginDemo(): void {
    this.authService.loginDemo();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService
      .login({ email, password })
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => this.router.navigateByUrl(this._returnUrl),
      });
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

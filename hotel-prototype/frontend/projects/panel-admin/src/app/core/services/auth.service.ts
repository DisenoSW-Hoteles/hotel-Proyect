import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthState, AuthUser } from '../../core/models';
import { APP_ROUTES } from '../../shared/constants/app-routes';
import {
  LoginRequestDto,
  LoginResponseDto,
  mapLoginResponseToUser,
} from '../../data/models';

const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  private readonly _authState$ = new BehaviorSubject<AuthState>(INITIAL_AUTH_STATE);

  readonly authState$ = this._authState$.asObservable();
  readonly currentUser$ = this.authState$.pipe(map((state) => state.user));
  readonly isAuthenticated$ = this.authState$.pipe(
    map((state) => state.isAuthenticated)
  );

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  getToken(): string | null {
    return this._authState$.getValue().token;
  }

  getCurrentUser(): AuthUser | null {
    return this._authState$.getValue().user;
  }

  login(credentials: LoginRequestDto): Observable<AuthUser> {
    this._patchState({ isLoading: true, error: null });

    return this.http
      .post<LoginResponseDto>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response) => ({
          user: mapLoginResponseToUser(response),
          token: response.access_token,
        })),
        tap(({ user, token }) => {
          this._patchState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }),
        map(({ user }) => user),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this._parseAuthError(error);
          this._patchState({ ...INITIAL_AUTH_STATE, error: errorMessage });
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): void {
    this._patchState(INITIAL_AUTH_STATE);
    this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
  }

  loginDemo(): void {
    const mockUser: AuthUser = {
      id: 'demo-001',
      email: 'demo@hotel.com',
      name: 'Demo Recepcionista',
      role: 'RECEPCIONISTA',
      sucursal: 'TEMUCO',
    };
    this._patchState({
      user: mockUser,
      token: 'demo-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }

  private _patchState(patch: Partial<AuthState>): void {
    this._authState$.next({
      ...this._authState$.getValue(),
      ...patch,
    });
  }

  private _parseAuthError(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Credenciales inválidas. Verifique su email y contraseña.';
    }
    if (error.status === 403) {
      return 'No tiene permisos para acceder al panel administrativo.';
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifique su conexión.';
    }
    return error.error?.message ?? 'Error inesperado. Intente nuevamente.';
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthState, AuthUser } from '../../core/models';
import { LoginRequestDto, LoginResponseDto, mapLoginResponseToUser } from '../dtos';

const SESSION_KEY = 'hotel_admin_session';

const MOCK_USER: AuthUser = {
  id: 'dev-001',
  email: 'admin@hotel.cl',
  name: 'Admin Desarrollo',
  role: 'SUPER_ADMIN',
  sucursal: 'TEMUCO',
};

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

  readonly authState$: Observable<AuthState> = this._authState$.asObservable();
  readonly currentUser$: Observable<AuthUser | null> = this.authState$.pipe(map((s) => s.user));
  readonly isAuthenticated$: Observable<boolean> = this.authState$.pipe(map((s) => s.isAuthenticated));

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    this._restoreSession();
  }

  getToken(): string | null {
    return this._authState$.getValue().token;
  }

  getCurrentUser(): AuthUser | null {
    return this._authState$.getValue().user;
  }

  login(credentials: LoginRequestDto, rememberMe = false): Observable<AuthUser> {
    this._patchState({ isLoading: true, error: null });

    if (environment.mockAuth) {
      this._patchState({ user: MOCK_USER, token: 'mock-token-dev', isAuthenticated: true, isLoading: false, error: null });
      if (rememberMe) this._saveSession(MOCK_USER, 'mock-token-dev');
      return of(MOCK_USER);
    }

    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const user = mapLoginResponseToUser(response);
        this._patchState({ user, token: response.access_token, isAuthenticated: true, isLoading: false, error: null });
        if (rememberMe) this._saveSession(user, response.access_token);
      }),
      map((response) => mapLoginResponseToUser(response)),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this._parseAuthError(error);
        this._patchState({ ...INITIAL_AUTH_STATE, error: errorMessage });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  loginDemo(): void {
    this._patchState({ user: MOCK_USER, token: 'demo-token', isAuthenticated: true, isLoading: false, error: null });
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this._patchState(INITIAL_AUTH_STATE);
    this.router.navigate(['/auth/login']);
  }

  private _saveSession(user: AuthUser, token: string): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
  }

  private _restoreSession(): void {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const { user, token } = JSON.parse(stored);
        this._patchState({ user, token, isAuthenticated: true, isLoading: false, error: null });
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private _patchState(patch: Partial<AuthState>): void {
    this._authState$.next({ ...this._authState$.getValue(), ...patch });
  }

  private _parseAuthError(error: HttpErrorResponse): string {
    if (error.status === 401) return 'Credenciales inválidas. Verifique su email y contraseña.';
    if (error.status === 403) return 'No tiene permisos para acceder al panel administrativo.';
    if (error.status === 0) return 'No se pudo conectar con el servidor. Verifique su conexión.';
    return error.error?.message ?? 'Error inesperado. Intente nuevamente.';
  }
}

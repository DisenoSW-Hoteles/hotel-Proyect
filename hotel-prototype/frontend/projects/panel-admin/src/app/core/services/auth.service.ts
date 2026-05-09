import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthState, AuthUser } from '../models';

interface LoginRequestDto {
  email: string;
  password: string;
}

interface LoginResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: { id: string; email: string; full_name: string; role: string; branch: string };
}

const mapLoginResponseToUser = (dto: LoginResponseDto): AuthUser => ({
  id: dto.user.id,
  email: dto.user.email,
  name: dto.user.full_name,
  role: dto.user.role as AuthUser['role'],
  sucursal: dto.user.branch as AuthUser['sucursal'],
});

const SESSION_KEY = 'hotel_admin_session';

const MOCK_USER: AuthUser = {
  id: 'dev-001',
  email: 'admin@hotel.cl',
  name: 'Admin Desarrollo',
  role: 'SUPER_ADMIN',
  sucursal: 'TEMUCO',
};

const INITIAL_STATE: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  private readonly _state$ = new BehaviorSubject<AuthState>(INITIAL_STATE);

  readonly authState$: Observable<AuthState> = this._state$.asObservable();
  readonly currentUser$: Observable<AuthUser | null> = this._state$.pipe(map((s) => s.user));
  readonly isAuthenticated$: Observable<boolean> = this._state$.pipe(map((s) => s.isAuthenticated));

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    this._restoreSession();
  }

  getToken(): string | null {
    return this._state$.getValue().token;
  }

  getCurrentUser(): AuthUser | null {
    return this._state$.getValue().user;
  }

  login(credentials: LoginRequestDto, rememberMe = false): Observable<AuthUser> {
    this._patch({ isLoading: true, error: null });

    if (environment.mockAuth) {
      this._patch({ user: MOCK_USER, token: 'mock-token-dev', isAuthenticated: true, isLoading: false });
      if (rememberMe) this._saveSession(MOCK_USER, 'mock-token-dev');
      return of(MOCK_USER);
    }

    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        const user = mapLoginResponseToUser(res);
        this._patch({ user, token: res.access_token, isAuthenticated: true, isLoading: false, error: null });
        if (rememberMe) this._saveSession(user, res.access_token);
      }),
      map((res) => mapLoginResponseToUser(res)),
      catchError((err: HttpErrorResponse) => {
        this._patch({ ...INITIAL_STATE, error: this._parseError(err) });
        return throwError(() => new Error(this._parseError(err)));
      })
    );
  }

  loginDemo(): void {
    this._patch({ user: MOCK_USER, token: 'demo-token', isAuthenticated: true, isLoading: false, error: null });
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this._patch(INITIAL_STATE);
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
        this._patch({ user, token, isAuthenticated: true });
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private _patch(patch: Partial<AuthState>): void {
    this._state$.next({ ...this._state$.getValue(), ...patch });
  }

  private _parseError(err: HttpErrorResponse): string {
    if (err.status === 401) return 'Credenciales inválidas. Verifique su email y contraseña.';
    if (err.status === 403) return 'No tiene permisos para acceder al panel administrativo.';
    if (err.status === 0) return 'No se pudo conectar con el servidor. Verifique su conexión.';
    return err.error?.message ?? 'Error inesperado. Intente nuevamente.';
  }
}

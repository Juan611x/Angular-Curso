import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject, computed, resource } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap, lastValueFrom } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    return this._user() ? 'authenticated' : 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  checkStatusResource = resource({
    loader: async () => lastValueFrom(this.checkAuthStatus()),
  }); //se ejecuta automáticamente al inyectar el servicio

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, { email, password }).pipe(
      tap(({ user, token }) => {
        this.handleLoginSuccess({ user, token });
      }),
      map(() => true),
      catchError((error) => this.handleLoginFailure(error))
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${BASE_URL}/auth/check-status`, {
        // Añadir el token en los headers
        // headers: { Authorization: `Bearer ${token}` }, en este caso lo maneja el interceptor
      })
      .pipe(
        tap(({ user, token }) => {
          this.handleLoginSuccess({ user, token });
        }),
        map(() => true),
        catchError((error) => this.handleLoginFailure(error))
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private handleLoginSuccess(authResponse: AuthResponse) {
    this._user.set(authResponse.user);
    this._token.set(authResponse.token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', authResponse.token);
  }

  private handleLoginFailure(error: any) {
    this.logout();
    return of(false);
  }
}

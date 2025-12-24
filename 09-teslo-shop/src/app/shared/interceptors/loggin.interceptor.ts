import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';

export function logginInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): ReturnType<HttpHandlerFn> {
  const token = inject(AuthService).token();

  const newReq = req.clone({
    // Clonar la petición ya que no es posible modificar la original
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}

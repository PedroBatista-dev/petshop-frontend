// src/app/core/interceptors/auth.interceptor.ts
import {
    HttpRequest,
    HttpHandlerFn, 
    HttpEvent,
    HttpInterceptorFn, 
    HttpErrorResponse
  } from '@angular/common/http';
  import { catchError, Observable, throwError } from 'rxjs';
  import { inject, Injector, PLATFORM_ID } from '@angular/core'; 
  import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environments';
import { AuthService } from '../../auth/service/auth.service';
  
  export const AuthInterceptor: HttpInterceptorFn = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {
    const injector = inject(Injector);
    const platformId = injector.get(PLATFORM_ID);
    const authService = injector.get(AuthService);
    const isBrowser = isPlatformBrowser(platformId);
  
    let token: string | null = null;
  
    // CORREÇÃO AQUI: Acessa localStorage SOMENTE se estiver no navegador
    if (isBrowser) {
      token = localStorage.getItem('jwt_token');
    }
  
    const isApiUrl = request.url.startsWith(environment.backendAuthUrl);
  
    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  
    return next(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  };
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip 401 on login endpoint — auth.service handles it
      const isLoginReq = req.url.includes('/Auth/login');

      switch (error.status) {
        case 401:
          if (!isLoginReq) {
            toast.show('Session expired. Please log in again.', 'error');
            router.navigate(['/login']);
          }
          break;
        case 404:
          // Let individual services handle 404
          break;
        case 500:
          toast.show('Server error. Please try again later.', 'error');
          break;
        case 0:
          toast.show('Network error. Check your internet connection.', 'error');
          break;
        default:
          toast.show('An unexpected error occurred.', 'error');
      }
      return throwError(() => error);
    })
  );
};

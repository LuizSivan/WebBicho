import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	
	constructor(
			private router: Router,
			private authService: AuthService
	) {
	}
	
	intercept(
			request: HttpRequest<any>,
			next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token: string = this.authService.getToken();
		if (token) {
			request = request.clone({
				setHeaders: {
					'auth': token,
				},
			});
		}
		return next.handle(request);
	}
}

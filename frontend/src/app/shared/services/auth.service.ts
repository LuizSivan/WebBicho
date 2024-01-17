import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IAuthenticatedToken } from '../interfaces/i-authenticated-token';
import { HttpRequest } from '../utils/http-request';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	
	constructor(
			private cookieService: CookieService,
			private http: HttpClient
	) {
	}
	
	setToken(token: string): void {
		this.cookieService.set('jwtToken', token, 1, '/', '', false, 'Strict');
	}
	
	getToken(): string {
		return this.cookieService.get('jwtToken');
	}
	
	removeToken(): void {
		this.cookieService.delete('jwtToken');
	}
	
	checkAuthStatus(): Observable<IAuthenticatedToken> {
		return new HttpRequest<IAuthenticatedToken>(this.http)
				.setEndpoint(this.getEndpoint())
				.doGet();
	}
	
	private getEndpoint(): string {
		return 'auth';
	}
}

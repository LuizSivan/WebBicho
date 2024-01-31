import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {IAuthenticatedToken} from '../../shared/interfaces/i-authenticated-token';
import {HttpRequest} from '../../shared/utils/http-request';
import {HttpClient} from '@angular/common/http';
import {User} from '../../shared/models/entities/user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	
	readonly endpoint: string = 'auth';
	
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
				.setEndpoint(this.endpoint)
				.doGet();
	}
	
	verifyAccount(token: string): Observable<User> {
		return new HttpRequest<User>(this.http)
				.setEndpoint(this.endpoint)
				.setUri('verify-account')
				.addParam('token', token)
				.doPatch();
	}
	
	
	register(user: User): Observable<User> {
		return new HttpRequest<User>(this.http)
				.setEndpoint(this.endpoint)
				.setUri('register')
				.addBody(user)
				.doPost();
	}
	
	login(user: User): Observable<User> {
		return new HttpRequest<User>(this.http)
				.setEndpoint(this.endpoint)
				.setUri('login')
				.addBody(user)
				.doPost();
	}
}

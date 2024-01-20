import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../shared/models/entities/user';
import { Router } from '@angular/router';

@Component({
	selector: 'wb-login-register',
	templateUrl: './login-register.component.html',
	styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {
	
	user: User = new User();
	
	constructor(
			private router: Router,
			private authService: AuthService,
	) {
	}
	
	doRegister(): void {
		this.authService.register(this.user).subscribe({
			next: async (user: User): Promise<void> => {
				if (user?.token) {
					await this.router.navigateByUrl('/home');
				}
			},
			error: (error: any): void => {
				console.log(error);
			}
		});
	}
	
	doLogin(): void {
		this.authService.login(this.user).subscribe({
			next: async (user: User): Promise<void> => {
				if (user?.token) {
					this.authService.setToken(user.token);
					await this.router.navigateByUrl('/home');
				}
			},
			error: (error: any): void => {
				console.log(error);
			}
		});
	}
}

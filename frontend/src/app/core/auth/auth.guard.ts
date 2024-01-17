import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
): Promise<boolean> => {
	try {
		const isLoginRoute: boolean = state.url.startsWith('/login');
		const isRegisterRoute: boolean = state.url.startsWith('/register');
		if (isLoginRoute || isRegisterRoute) {
			return true;
		}
		const authService: AuthService = inject(AuthService);
		await firstValueFrom(authService.checkAuthStatus());
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

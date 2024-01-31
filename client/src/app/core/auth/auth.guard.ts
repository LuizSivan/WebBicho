import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';

export const authGuard: CanActivateFn = async (
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
): Promise<boolean> => {
	const authService: AuthService = inject(AuthService);
	try {
		await firstValueFrom(authService.checkAuthStatus());
		return true;
	} catch (err) {
		console.error(err);
		authService.removeToken();
		return false;
	}
};

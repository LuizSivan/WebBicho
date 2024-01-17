import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
): Promise<boolean> => {
	try {
		const authService: AuthService = inject(AuthService);
		await firstValueFrom(authService.checkAuthStatus());
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

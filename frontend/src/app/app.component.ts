import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title: string = 'Webbicho';
	
	constructor(
			private themeService: ThemeService,
			private primengConfig: PrimeNGConfig,
	) {
		this.primengConfig.ripple = true;
		this.themeService.loadDefaultTheme();
	}
	
	get containerClass() {
		return {
			'layout-theme-light': this.themeService.config().colorScheme === 'light',
			'layout-theme-dark': this.themeService.config().colorScheme === 'dark',
			'layout-overlay': this.themeService.config().menuMode === 'overlay',
			'layout-static': this.themeService.config().menuMode === 'static',
			'layout-static-inactive': this.themeService.state.staticMenuDesktopInactive && this.themeService.config().menuMode === 'static',
			'layout-overlay-active': this.themeService.state.overlayMenuActive,
			'layout-mobile-active': this.themeService.state.staticMenuMobileActive,
			'p-input-filled': this.themeService.config().inputStyle === 'filled',
			'p-ripple-disabled': !this.themeService.config().ripple
		};
	}
	
	changeTheme(): void {
		this.themeService.switchTheme();
	}
}

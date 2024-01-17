import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'Webbicho';
	
	constructor(
			private themeService: ThemeService,
			private primengConfig: PrimeNGConfig,
	) {
		this.primengConfig.ripple = true;
	}
	
	get theme(): string {
		return this.themeService.config().theme;
	}
	
	set theme(val: string) {
		this.themeService.config.update((config) => ({
			...config,
			theme: val,
		}));
	}
	
	set colorScheme(val: string) {
		this.themeService.config.update((config) => ({
			...config,
			colorScheme: val,
		}));
	}
	
	changeTheme(): void {
		const theme: string = localStorage.getItem('theme') ?? 'light';
		this.theme = theme == 'dark' ? 'lara-light-blue' : 'lara-dark-blue';
		this.colorScheme = theme == 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme == 'dark' ? 'light' : 'dark');
	}
}

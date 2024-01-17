import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	private currentTheme: string = 'lara-light-blue';
	
	constructor() {
	}
	
	switchTheme(): void {
		const link: HTMLLinkElement = document.getElementById('app-theme') as HTMLLinkElement;
		document.body.classList.toggle('theme-dark');
		const isDarkTheme: boolean = link.href.includes('theme-dark');
		link.href = `assets/theme/theme-${isDarkTheme ? 'light' : 'dark'}.css`;
		localStorage.setItem('app-theme', isDarkTheme ? 'light' : 'dark');
		console.log(`Theme: ${isDarkTheme ? 'light' : 'dark'}`);
	}
	
	loadDefaultTheme(): void {
		const colorTheme: string | null = localStorage.getItem('app-theme');
		const link: HTMLLinkElement = document.getElementById('app-theme') as HTMLLinkElement;
		if (link) link.href = `assets/theme/theme-${colorTheme ?? 'light'}.css`;
		localStorage.setItem('app-theme', colorTheme ?? 'light');
		console.log(`Default theme: ${colorTheme ?? 'light'}`);
	}
}

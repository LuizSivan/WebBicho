import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { IThemeConfig } from '../interfaces/i-theme-config';
import { Subject } from 'rxjs';
import { ILayoutState } from '../interfaces/i-layout-state';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	
	_config: IThemeConfig = {
		ripple: true,
		inputStyle: 'outlined',
		menuMode: 'static',
		colorScheme: 'light',
		theme: 'lara-light-blue',
		scale: 14,
	};
	
	state: ILayoutState = {
		staticMenuDesktopInactive: false,
		overlayMenuActive: false,
		profileSidebarVisible: false,
		configSidebarVisible: false,
		staticMenuMobileActive: false,
		menuHoverActive: false,
	};
	config: WritableSignal<IThemeConfig> = signal<IThemeConfig>(this._config);
	private configUpdate: Subject<IThemeConfig> = new Subject<IThemeConfig>();
	private overlayOpen: Subject<any> = new Subject<any>();
	
	/*configUpdate$: Observable<IThemeConfig> = this.configUpdate.asObservable();
	overlayOpen$: Observable<any> = this.overlayOpen.asObservable();*/
	
	constructor() {
		effect((): void => {
			const config: IThemeConfig = this.config();
			if (this.updateStyle(config)) {
				this.changeTheme();
			}
			this.changeScale(config.scale);
			this.onConfigUpdate();
		});
	}
	
	onMenuToggle(): void {
		if (this.isOverlay()) {
			this.state.overlayMenuActive = !this.state.overlayMenuActive;
			if (this.state.overlayMenuActive) {
				this.overlayOpen.next(null);
			}
		}
		
		if (this.isDesktop()) {
			this.state.staticMenuDesktopInactive =
					!this.state.staticMenuDesktopInactive;
		} else {
			this.state.staticMenuMobileActive =
					!this.state.staticMenuMobileActive;
			
			if (this.state.staticMenuMobileActive) {
				this.overlayOpen.next(null);
			}
		}
	}
	
	showProfileSidebar(): void {
		this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
		if (this.state.profileSidebarVisible) {
			this.overlayOpen.next(null);
		}
	}
	
	showConfigSidebar(): void {
		this.state.configSidebarVisible = true;
	}
	
	isOverlay(): boolean {
		return this.config().menuMode === 'overlay';
	}
	
	isDesktop(): boolean {
		return window.innerWidth > 991;
	}
	
	isMobile(): boolean {
		return !this.isDesktop();
	}
	
	onConfigUpdate(): void {
		this._config = {...this.config()};
		this.configUpdate.next(this.config());
	}
	
	changeTheme(): void {
		const config: IThemeConfig = this.config();
		const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
		const themeLinkHref: string = themeLink.getAttribute('href')!;
		const newHref: string = themeLinkHref
				.split('/')
				.map((el: string): string =>
						el == this._config.theme
								? (el = config.theme)
								: el == `theme-${this._config.colorScheme}`
										? (el = `theme-${config.colorScheme}`)
										: el
				)
				.join('/');
		this.replaceThemeLink(newHref);
	}
	
	replaceThemeLink(href: string): void {
		const id: string = 'theme-css';
		let themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById(id);
		const cloneLinkElement: HTMLLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);
		
		cloneLinkElement.setAttribute('href', href);
		cloneLinkElement.setAttribute('id', id + '-clone');
		
		themeLink.parentNode!.insertBefore(
				cloneLinkElement,
				themeLink.nextSibling
		);
		cloneLinkElement.addEventListener('load', (): void => {
			themeLink.remove();
			cloneLinkElement.setAttribute('id', id);
		});
	}
	
	updateStyle(config: IThemeConfig): boolean {
		return (
				config.theme !== this._config.theme ||
				config.colorScheme !== this._config.colorScheme
		);
	}
	
	changeScale(value: number): void {
		document.documentElement.style.fontSize = `${value}px`;
	}
}

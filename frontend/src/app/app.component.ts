import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title: string = 'Webbicho';
	items: MenuItem[] | undefined;
	
	constructor(
			private themeService: ThemeService,
			private primengConfig: PrimeNGConfig,
	) {
		this.primengConfig.ripple = true;
		this.themeService.loadDefaultTheme();
		
	}
}

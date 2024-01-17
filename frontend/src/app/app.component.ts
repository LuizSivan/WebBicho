import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'Webbicho';
	
	constructor(
			private themeService: ThemeService
	) {
		// this.themeService.loadDefaultTheme();
	}
	
	teste(): void {
		// this.themeService.switchTheme();
	}
}

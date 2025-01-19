import {Component} from '@angular/core';
import {ThemeService} from './shared/services/theme.service';
import {MenuItem} from 'primeng/api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: false
})
export class AppComponent {
	title: string = 'Webbicho';
	items: MenuItem[] | undefined;
	
	constructor(
			private themeService: ThemeService
	) {
		this.themeService.loadDefaultTheme();
		
	}
}

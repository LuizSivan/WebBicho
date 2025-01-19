import {Component} from '@angular/core';
import {ButtonModule} from 'primeng/button';

@Component({
	selector: 'app-root',
	imports: [ButtonModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'client';
}

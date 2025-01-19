import {
	Component,
	Input
} from '@angular/core';

@Component({
	selector: 'wb-label',
	templateUrl: './label.component.html',
	styleUrls: ['./label.component.scss'],
	standalone: false
})
export class LabelComponent {
	@Input()
	label: string;
	@Input()
	for: string;
	@Input()
	float: boolean = false;
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginRegisterComponent} from './login-register.component';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {LabelModule} from '../../shared/components/label/label.module';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';


@NgModule({
	declarations: [
		LoginRegisterComponent
	],
	imports: [
		CommonModule,
		CardModule,
		InputTextModule,
		LabelModule,
		FormsModule,
		ButtonModule,
		RippleModule
	]
})
export class LoginRegisterModule {
}

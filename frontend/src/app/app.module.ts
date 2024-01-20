import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DockModule } from 'primeng/dock';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';

import pt from '@angular/common/locales/pt';
import ptExtra from '@angular/common/locales/extra/pt';
import { LoginRegisterModule } from './pages/login-register/login-register.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeModule } from './pages/home/home.module';

registerLocaleData(pt, 'pt', ptExtra);

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		ButtonModule,
		RippleModule,
		DockModule,
		LoginRegisterModule,
		HomeModule
	],
	providers: [
		{provide: LocationStrategy, useClass: HashLocationStrategy},
		{provide: LOCALE_ID, useValue: 'pt-BR'},
		HttpClient
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

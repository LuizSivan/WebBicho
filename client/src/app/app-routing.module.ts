import {NgModule} from '@angular/core';
import {
	RouterModule,
	Routes
} from '@angular/router';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './core/auth/auth.interceptor';
import {LoginRegisterComponent} from './pages/login-register/login-register.component';
import {authGuard} from './core/auth/auth.guard';
import {VerifyAccountComponent} from './pages/verify-account/verify-account.component';
import {HomeComponent} from './pages/home/home.component';

const routes: Routes = [
	{path: 'login', component: LoginRegisterComponent},
	{path: 'verify', component: VerifyAccountComponent},
	{
		path: '',
		canActivate: [authGuard],
		children: [
			{path: 'home', component: HomeComponent},
			{path: '', redirectTo: 'home', pathMatch: 'full'},
		],
	},
	{path: '**', redirectTo: 'login'},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		}
	]
})
export class AppRoutingModule {
}

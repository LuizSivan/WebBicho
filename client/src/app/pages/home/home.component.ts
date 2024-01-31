import {Component} from '@angular/core';
import {ThemeService} from '../../shared/services/theme.service';
import {PostService} from '../../shared/services/post.service';
import {WhereParam} from '../../shared/interfaces/types/where-param';
import {Post} from '../../shared/models/entities/post';

@Component({
	selector: 'wb-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	
	constructor(
			private themeService: ThemeService,
			private postService: PostService,
	) {
	}
	
	get containerClass(): any {
		return {
			'layout-theme-light': this.themeService.config().colorScheme === 'light',
			'layout-theme-dark': this.themeService.config().colorScheme === 'dark',
			'layout-overlay': this.themeService.config().menuMode === 'overlay',
			'layout-static': this.themeService.config().menuMode === 'static',
			'layout-static-inactive': this.themeService.state.staticMenuDesktopInactive && this.themeService.config().menuMode === 'static',
			'layout-overlay-active': this.themeService.state.overlayMenuActive,
			'layout-mobile-active': this.themeService.state.staticMenuMobileActive,
			'p-input-filled': this.themeService.config().inputStyle === 'filled',
			'p-ripple-disabled': !this.themeService.config().ripple
		};
	}
	
	changeTheme(): void {
		this.themeService.switchTheme();
		const sp: WhereParam<Post>[] = [
			{
				id: {between: ['uuid1', 'uuid2']},
				user: {
					id: {equals: 'uuid3'},
					name: {equals: ''},
					comment: {
						id: {equals: 'uuid4'},
					}
				}
			}
		];
		this.postService.getList(0, 10);
	}
}

/*const where: any[] = [
	{
		id: Between(value1, value2),
		user: {
			id: 'uuid',
			name: '',
			comment: {
				id: 'uuid',
			}
		}
	}
]*/

import {
	Controller,
	Get
} from '@nestjs/common';

@Controller()
export class AppController {
	
	@Get('meow')
	public async miau(): Promise<string> {
		return '<h1>Woof!</h1>';
	}
}

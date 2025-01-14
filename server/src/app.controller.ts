import {
	Controller,
	Get
} from '@nestjs/common';

@Controller()
export class AppController {
	
	@Get('miau')
	public async miau(): Promise<string> {
		return 'Woof!';
	}
}

import {Test, TestingModule} from '@nestjs/testing';
import {GenericController} from './generic.controller';

describe('GenericController', () => {
	let controller: GenericController;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GenericController],
		}).compile();
		
		controller = module.get<GenericController>(GenericController);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

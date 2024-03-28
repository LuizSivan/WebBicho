import {Test, TestingModule} from '@nestjs/testing';
import {GenericService} from './generic.service';

describe('GenericService', () => {
	let service: GenericService;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GenericService],
		}).compile();
		
		service = module.get<GenericService>(GenericService);
	});
	
	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});

import {
	Test,
	TestingModule
} from '@nestjs/testing';
import {GenericService} from './generic.service';
import {GenericEntity} from '../shared/models/entities/generic-entity';

describe('GenericService', (): void => {
	let service: GenericService<GenericEntity>;
  
	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: GenericService,
					useClass: GenericEntity,
				},
			],
		}).compile();
    
		service = module.get<GenericService<GenericEntity>>(GenericService);
	});
  
	it('should be defined', (): void => {
		expect(service).toBeDefined();
	});
});

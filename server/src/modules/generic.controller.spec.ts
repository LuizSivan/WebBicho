import {GenericEntity} from '../shared/models/entities/generic-entity';
import {GenericService} from './generic.service';
import {Repository} from 'typeorm';

describe('GenericService', () => {
	let service: GenericService<GenericEntity>;
	let repository: Repository<GenericEntity>; // Repository real para testes
  
	beforeEach(() => {
		// Crie uma instância real do Repository para cada teste
		repository = new Repository<GenericEntity>();
    
		// Inicialize o GenericService com o Repository real
		service = new GenericService<GenericEntity>(repository);
	});
  
	it('should be defined', () => {
		expect(service).toBeDefined();
	});
  
	// Adicione mais casos de teste conforme necessário para testar outros comportamentos do GenericService
});

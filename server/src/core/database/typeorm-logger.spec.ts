import {TypeORMLogger} from './typeorm-logger';

describe('CustomLogger', () => {
	it('should be defined', () => {
		expect(new TypeORMLogger()).toBeDefined();
	});
});

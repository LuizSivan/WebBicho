import {CheckOwnershipGuard} from './check-ownership.guard';

describe('CheckOwnershipGuard', () => {
	it('should be defined', () => {
		expect(new CheckOwnershipGuard()).toBeDefined();
	});
});

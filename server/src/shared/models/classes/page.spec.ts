import {Page} from './page';

describe('Page', (): void => {
	it('should create a Page instance with any type', (): void => {
		const pageAnyNumber: Page<any> = new Page<any>([1, 2, 3], 1, 2, 3);
		const pageAnyString: Page<any> = new Page<any>(['a', 'b', 'c'], 1, 2, 3);
		const pageAnyObject: Page<any> = new Page<any>([{id: 1, name: 'John'}], 1, 1, 1);
    
		expect(pageAnyNumber).toBeDefined();
		expect(pageAnyNumber.content).toEqual([1, 2, 3]);
		expect(pageAnyNumber.currentPage).toBe(1);
		expect(pageAnyNumber.totalPages).toBe(2);
		expect(pageAnyNumber.totalItems).toBe(3);
    
		expect(pageAnyString).toBeDefined();
		expect(pageAnyString.content).toEqual(['a', 'b', 'c']);
		expect(pageAnyString.currentPage).toBe(1);
		expect(pageAnyString.totalPages).toBe(2);
		expect(pageAnyString.totalItems).toBe(3);
    
		expect(pageAnyObject).toBeDefined();
		expect(pageAnyObject.content).toEqual([{id: 1, name: 'John'}]);
		expect(pageAnyObject.currentPage).toBe(1);
		expect(pageAnyObject.totalPages).toBe(1);
		expect(pageAnyObject.totalItems).toBe(1);
	});
});

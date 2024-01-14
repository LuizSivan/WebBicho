export class Page<T> {
	content: T[];
	currentPage: number;
	totalPages: number;
	totalItems: number;
	
	constructor(
			content: T[],
			currentPage: number,
			totalPages: number,
			totalItems: number
	) {
		this.content = content;
		this.currentPage = currentPage;
		this.totalPages = totalPages;
		this.totalItems = totalItems;
	}
}

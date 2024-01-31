export interface IPage<T> {
	content: T[];
	currentPage: number;
	totalPages: number;
	totalItems: number;
}

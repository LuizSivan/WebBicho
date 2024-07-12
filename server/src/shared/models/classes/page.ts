import {ApiProperty} from '@nestjs/swagger';

export class Page<T> {
	@ApiProperty()
  content!: T[];
  
	@ApiProperty()
  currentPage!: number;
  
	@ApiProperty()
  totalPages!: number;
  
	@ApiProperty()
  totalItems!: number;
  
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

import {Injectable} from '@angular/core';
import {GenericService} from './generic.service';
import {Post} from '../models/entities/post';
import {HttpClient} from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class PostService extends GenericService<Post> {
	
	endpoint: string = 'post';
	
	constructor(
			http: HttpClient
	) {
		super(http);
	}
}

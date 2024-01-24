import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpRequest} from '../utils/http-request';
import {IPage} from '../interfaces/i-page';
import {GenericEntity} from '../models/entities/generic-entity';
import {SearchParam} from '../interfaces/types/search-param';

@Injectable({
	providedIn: 'root'
})
export abstract class GenericService<T extends GenericEntity> {
	
	http: HttpClient;
	
	abstract endpoint: string;
	
	protected constructor(
			http: HttpClient
	) {
		this.http = http;
	}
	
	getList(
			searchParams: SearchParam<T>[] = []
	): Observable<IPage<T>> {
		return new HttpRequest<IPage<T>>(this.http)
				.setEndpoint(this.endpoint)
				.addHeader('search-params', JSON.stringify(searchParams))
				.doGet();
	}
	
	// getById(id: string): Observable<T> {
	//   return this.http.get<T>(`${this.endpoint()}/${id}`);
	// }
	//
	// create(item: T): Observable<T> {
	//   return this.http.post<T>(this.endpoint(), item);
	// }
	//
	// update(id: string, item: T): Observable<T> {
	//   return this.http.put<T>(`${this.endpoint()}/${id}`, item);
	// }
	//
	// delete(id: string): Observable<void> {
	//   return this.http.delete<void>(`${this.endpoint()}/${id}`);
	// }
}

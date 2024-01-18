import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpRequest } from '../utils/http-request';

@Injectable({
	providedIn: 'root'
})
export abstract class GenericService<T> {
	
	constructor(protected http: HttpClient) {
	}
	
	abstract getEndpoint(): string;
	
	getList(): Observable<T[]> {
		return new HttpRequest<T[]>(this.http)
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

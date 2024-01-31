import {Observable} from 'rxjs';

export interface IHttpRequest<T> {
	setEndpoint(endpoint: string): IHttpRequest<T>;
	
	setUri(uri: string): IHttpRequest<T>;
	
	addHeader(key: string, value: string | number | boolean): IHttpRequest<T>;
	
	addParam(key: string, value: string | number | boolean): IHttpRequest<T>;
	
	addBody(body: T): IHttpRequest<T>;
	
	doPost(): Observable<T>;
	
	doGet(): Observable<T>;
	
	doPut(): Observable<T>;
	
	doDelete(): Observable<T>;
	
	doPatch(): Observable<T>;
}

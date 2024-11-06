import {Observable} from 'rxjs';

export interface HttpRequest<T> {
  setEndpoint(endpoint: string): HttpRequest<T>;

  setUri(uri: string): HttpRequest<T>;

  addHeader(key: string, value: string | number | boolean): HttpRequest<T>;

  addParam(key: string, value: string | number | boolean): HttpRequest<T>;

  addBody(body: T): HttpRequest<T>;

  doPost(): Observable<T>;

  doGet(): Observable<T>;

  doPut(): Observable<T>;

  doDelete(): Observable<T>;

  doPatch(): Observable<T>;
}

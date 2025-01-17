import {HttpRequest} from '../interfaces/http-request';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../core/environments/environment';

export class RequestBuilder<T> implements HttpRequest<T> {
  private endpoint: string;
  private uri: string = '/';
  private headers: { key: string, value: string | number | boolean }[] = [];
  private params: { key: string, value: string | number | boolean }[] = [];
  private body: T | undefined;
  private url: string = environment.apiServer;

  constructor(private http: HttpClient) {
  }

  addBody(body: T): RequestBuilder<T> {
    this.body = body;
    return this;
  }

  addHeader(key: string, value: string | number | boolean): RequestBuilder<T> {
    this.headers.push({key, value});
    return this;
  }

  addParam(key: string, value: string | number | boolean): RequestBuilder<T> {
    this.params.push({key, value});
    return this;
  }

  doGet(): Observable<T> {
    return this.http.get<T>(this.buildUrl(), {headers: this.getHeaders()});
  }

  doDelete(): Observable<T> {
    return this.http.delete<T>(this.buildUrl(), {headers: this.getHeaders()});
  }

  doPost(): Observable<T> {
    return this.http.post<T>(this.buildUrl(), this.body, {headers: this.getHeaders()});
  }

  doPut(): Observable<T> {
    return this.http.put<T>(this.buildUrl(), this.body, {headers: this.getHeaders()});
  }

  doPatch(): Observable<T> {
    return this.http.patch<T>(this.buildUrl(), this.body, {headers: this.getHeaders()});
  }

  setEndpoint(endpoint: string): RequestBuilder<T> {
    this.endpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return this;
  }

  setUri(uri: string): RequestBuilder<T> {
    this.uri = uri.startsWith('/') ? uri : '/' + uri;
    return this;
  }

  private buildQueryString(): string {
    const params: URLSearchParams = this.getParams();
    return params.toString() ? `?${params.toString()}` : '';
  }

  private buildUrl(): string {
    return `${this.url}${this.endpoint}${this.uri}${this.buildQueryString()}`;
  }

  private getParams(): URLSearchParams {
    return this.params.reduce((params: URLSearchParams, param: {
      key: string,
      value: string | number | boolean
    }) => {
      params.append(param.key, `${param.value}`);
      return params;
    }, new URLSearchParams());
  }

  private getHeaders(): HttpHeaders {
    return this.headers.reduce((headers: HttpHeaders, header: {
      key: string,
      value: string | number | boolean
    }) => {
      headers.append(header.key, `${header.value}`);
      return headers;
    }, new HttpHeaders());
  }
}

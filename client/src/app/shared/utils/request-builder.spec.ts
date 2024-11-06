import {RequestBuilder} from './request-builder';

describe('HttpRequest', () => {
  it('should create an instance', () => {
    expect(new RequestBuilder()).toBeTruthy();
  });
});

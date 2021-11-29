import { AuthenticationQuery } from './authentication.query';
import { AuthenticationStore } from './authentication.store';

describe('AuthenticationQuery', () => {
  let query: AuthenticationQuery;

  beforeEach(() => {
    query = new AuthenticationQuery(new AuthenticationStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

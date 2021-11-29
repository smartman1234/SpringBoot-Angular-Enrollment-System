import { AuthenticationStore } from './authentication.store';

describe('AuthenticationStore', () => {
  let store: AuthenticationStore;

  beforeEach(() => {
    store = new AuthenticationStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

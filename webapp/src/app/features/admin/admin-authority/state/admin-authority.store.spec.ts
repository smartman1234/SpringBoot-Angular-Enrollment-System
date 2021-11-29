import { AdminAuthorityStore } from './admin-authority.store';

describe('AdminAuthorityStore', () => {
  let store: AdminAuthorityStore;

  beforeEach(() => {
    store = new AdminAuthorityStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

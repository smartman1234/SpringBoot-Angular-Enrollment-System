import { AdminUserStore } from './admin-user.store';

describe('AdminUserStore', () => {
  let store: AdminUserStore;

  beforeEach(() => {
    store = new AdminUserStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

import { AdminTermStore } from './admin-term.store';

describe('AdminTermStore', () => {
  let store: AdminTermStore;

  beforeEach(() => {
    store = new AdminTermStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

import { AdminCollegeStore } from './admin-college.store';

describe('AdminCollegeStore', () => {
  let store: AdminCollegeStore;

  beforeEach(() => {
    store = new AdminCollegeStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

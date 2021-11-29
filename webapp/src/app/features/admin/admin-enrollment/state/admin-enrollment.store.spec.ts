import { AdminEnrollmentStore } from './admin-enrollment.store';

describe('AdminEnrollmentStore', () => {
  let store: AdminEnrollmentStore;

  beforeEach(() => {
    store = new AdminEnrollmentStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

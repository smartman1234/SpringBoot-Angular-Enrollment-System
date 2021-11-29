import { AdminInstructorStore } from './admin-instructor.store';

describe('AdminInstructorStore', () => {
  let store: AdminInstructorStore;

  beforeEach(() => {
    store = new AdminInstructorStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

import { AdminStudentStore } from './admin-student.store';

describe('AdminStudentStore', () => {
  let store: AdminStudentStore;

  beforeEach(() => {
    store = new AdminStudentStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

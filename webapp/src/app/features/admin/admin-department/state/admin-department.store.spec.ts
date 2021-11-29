import { AdminDepartmentStore } from './admin-department.store';

describe('AdminDepartmentStore', () => {
  let store: AdminDepartmentStore;

  beforeEach(() => {
    store = new AdminDepartmentStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

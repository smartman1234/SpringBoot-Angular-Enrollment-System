import { AdminDepartmentQuery } from './admin-department.query';
import { AdminDepartmentStore } from './admin-department.store';

describe('AdminDepartmentQuery', () => {
  let query: AdminDepartmentQuery;

  beforeEach(() => {
    query = new AdminDepartmentQuery(new AdminDepartmentStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

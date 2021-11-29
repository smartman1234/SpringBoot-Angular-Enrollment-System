import { AdminStudentQuery } from './admin-student.query';
import { AdminStudentStore } from './admin-student.store';

describe('AdminStudentQuery', () => {
  let query: AdminStudentQuery;

  beforeEach(() => {
    query = new AdminStudentQuery(new AdminStudentStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

import { AdminInstructorQuery } from './admin-instructor.query';
import { AdminInstructorStore } from './admin-instructor.store';

describe('AdminInstructorQuery', () => {
  let query: AdminInstructorQuery;

  beforeEach(() => {
    query = new AdminInstructorQuery(new AdminInstructorStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

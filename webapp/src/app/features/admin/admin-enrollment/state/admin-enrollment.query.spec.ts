import { AdminEnrollmentQuery } from './admin-enrollment.query';
import { AdminEnrollmentStore } from './admin-enrollment.store';

describe('AdminEnrollmentQuery', () => {
  let query: AdminEnrollmentQuery;

  beforeEach(() => {
    query = new AdminEnrollmentQuery(new AdminEnrollmentStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

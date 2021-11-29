import { AdminCollegeQuery } from './admin-college.query';
import { AdminCollegeStore } from './admin-college.store';

describe('AdminCollegeQuery', () => {
  let query: AdminCollegeQuery;

  beforeEach(() => {
    query = new AdminCollegeQuery(new AdminCollegeStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

import { EnrollmentQuery } from './enrollment.query';
import { EnrollmentStore } from './enrollment.store';

describe('EnrollmentQuery', () => {
  let query: EnrollmentQuery;

  beforeEach(() => {
    query = new EnrollmentQuery(new EnrollmentStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

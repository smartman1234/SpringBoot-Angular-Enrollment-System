import { EnrollmentIdQuery } from './enrollment-id.query';
import { EnrollmentIdStore } from './enrollment-id.store';

describe('EnrollmentIdQuery', () => {
  let query: EnrollmentIdQuery;

  beforeEach(() => {
    query = new EnrollmentIdQuery(new EnrollmentIdStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

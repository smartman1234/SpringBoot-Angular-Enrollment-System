import { AdminSubjectQuery } from './admin-subject.query';
import { AdminSubjectStore } from './admin-subject.store';

describe('AdminSubjectQuery', () => {
  let query: AdminSubjectQuery;

  beforeEach(() => {
    query = new AdminSubjectQuery(new AdminSubjectStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

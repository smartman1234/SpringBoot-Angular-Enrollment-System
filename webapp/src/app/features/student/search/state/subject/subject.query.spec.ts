import { SubjectQuery } from './subject.query';
import { SubjectStore } from './subject.store';

describe('SubjectQuery', () => {
  let query: SubjectQuery;

  beforeEach(() => {
    query = new SubjectQuery(new SubjectStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

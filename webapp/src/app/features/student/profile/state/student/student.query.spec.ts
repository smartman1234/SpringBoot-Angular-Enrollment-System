import { StudentQuery } from './student.query';
import { StudentStore } from './student.store';

describe('StudentQuery', () => {
  let query: StudentQuery;

  beforeEach(() => {
    query = new StudentQuery(new StudentStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

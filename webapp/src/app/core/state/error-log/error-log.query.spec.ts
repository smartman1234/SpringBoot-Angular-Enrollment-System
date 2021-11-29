import { ErrorLogQuery } from './error-log.query';
import { ErrorLogStore } from './error-log.store';

describe('ErrorLogQuery', () => {
  let query: ErrorLogQuery;

  beforeEach(() => {
    query = new ErrorLogQuery(new ErrorLogStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

import { LoadingQuery } from './loading.query';
import { LoadingStore } from './loading.store';

describe('LoadingQuery', () => {
  let query: LoadingQuery;

  beforeEach(() => {
    query = new LoadingQuery(new LoadingStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

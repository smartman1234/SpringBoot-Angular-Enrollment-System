import { SearchInputQuery } from './search-input.query';
import { SearchInputStore } from './search-input.store';

describe('SearchInputQuery', () => {
  let query: SearchInputQuery;

  beforeEach(() => {
    query = new SearchInputQuery(new SearchInputStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

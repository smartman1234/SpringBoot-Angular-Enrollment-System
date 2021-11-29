import { SearchInputStore } from './search-input.store';

describe('SearchInputStore', () => {
  let store: SearchInputStore;

  beforeEach(() => {
    store = new SearchInputStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

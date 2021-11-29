import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SearchInputService } from './search-input.service';
import { SearchInputStore } from './search-input.store';

describe('SearchInputService', () => {
  let searchInputService: SearchInputService;
  let searchInputStore: SearchInputStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchInputService, SearchInputStore],
      imports: [ HttpClientTestingModule ]
    });

    searchInputService = TestBed.inject(SearchInputService);
    searchInputStore = TestBed.inject(SearchInputStore);
  });

  it('should be created', () => {
    expect(searchInputService).toBeDefined();
  });

});

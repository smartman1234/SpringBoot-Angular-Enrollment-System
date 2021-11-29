import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TermService } from './term.service';
import { TermStore } from './term.store';

describe('TermService', () => {
  let termService: TermService;
  let termStore: TermStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TermService, TermStore],
      imports: [ HttpClientTestingModule ]
    });

    termService = TestBed.inject(TermService);
    termStore = TestBed.inject(TermStore);
  });

  it('should be created', () => {
    expect(termService).toBeDefined();
  });

});

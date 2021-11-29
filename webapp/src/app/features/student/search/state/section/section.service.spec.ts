import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SectionService } from './section.service';
import { SectionStore } from './section.store';

describe('SectionService', () => {
  let sectionService: SectionService;
  let sectionStore: SectionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectionService, SectionStore],
      imports: [ HttpClientTestingModule ]
    });

    sectionService = TestBed.inject(SectionService);
    sectionStore = TestBed.inject(SectionStore);
  });

  it('should be created', () => {
    expect(sectionService).toBeDefined();
  });

});

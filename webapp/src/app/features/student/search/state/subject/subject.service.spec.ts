import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SubjectService } from './subject.service';
import { SubjectStore } from './subject.store';

describe('SubjectService', () => {
  let subjectService: SubjectService;
  let subjectStore: SubjectStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubjectService, SubjectStore],
      imports: [ HttpClientTestingModule ]
    });

    subjectService = TestBed.inject(SubjectService);
    subjectStore = TestBed.inject(SubjectStore);
  });

  it('should be created', () => {
    expect(subjectService).toBeDefined();
  });

});

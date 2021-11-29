import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminSubjectService } from './admin-subject.service';
import { AdminSubjectStore } from './admin-subject.store';

describe('AdminSubjectService', () => {
  let adminSubjectService: AdminSubjectService;
  let adminSubjectStore: AdminSubjectStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminSubjectService, AdminSubjectStore],
      imports: [ HttpClientTestingModule ]
    });

    adminSubjectService = TestBed.inject(AdminSubjectService);
    adminSubjectStore = TestBed.inject(AdminSubjectStore);
  });

  it('should be created', () => {
    expect(adminSubjectService).toBeDefined();
  });

});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminInstructorService } from './admin-instructor.service';
import { AdminInstructorStore } from './admin-instructor.store';

describe('AdminInstructorService', () => {
  let adminInstructorService: AdminInstructorService;
  let adminInstructorStore: AdminInstructorStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminInstructorService, AdminInstructorStore],
      imports: [ HttpClientTestingModule ]
    });

    adminInstructorService = TestBed.inject(AdminInstructorService);
    adminInstructorStore = TestBed.inject(AdminInstructorStore);
  });

  it('should be created', () => {
    expect(adminInstructorService).toBeDefined();
  });

});

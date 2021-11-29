import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminStudentService } from './admin-student.service';
import { AdminStudentStore } from './admin-student.store';

describe('AdminStudentService', () => {
  let adminStudentService: AdminStudentService;
  let adminStudentStore: AdminStudentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminStudentService, AdminStudentStore],
      imports: [ HttpClientTestingModule ]
    });

    adminStudentService = TestBed.inject(AdminStudentService);
    adminStudentStore = TestBed.inject(AdminStudentStore);
  });

  it('should be created', () => {
    expect(adminStudentService).toBeDefined();
  });

});

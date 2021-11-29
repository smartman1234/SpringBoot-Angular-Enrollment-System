import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminEnrollmentService } from './admin-enrollment.service';
import { AdminEnrollmentStore } from './admin-enrollment.store';

describe('AdminEnrollmentService', () => {
  let adminEnrollmentService: AdminEnrollmentService;
  let adminEnrollmentStore: AdminEnrollmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminEnrollmentService, AdminEnrollmentStore],
      imports: [ HttpClientTestingModule ]
    });

    adminEnrollmentService = TestBed.inject(AdminEnrollmentService);
    adminEnrollmentStore = TestBed.inject(AdminEnrollmentStore);
  });

  it('should be created', () => {
    expect(adminEnrollmentService).toBeDefined();
  });

});

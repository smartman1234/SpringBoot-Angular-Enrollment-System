import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentStore } from './enrollment.store';

describe('EnrollmentService', () => {
  let enrollmentService: EnrollmentService;
  let enrollmentStore: EnrollmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnrollmentService, EnrollmentStore],
      imports: [ HttpClientTestingModule ]
    });

    enrollmentService = TestBed.inject(EnrollmentService);
    enrollmentStore = TestBed.inject(EnrollmentStore);
  });

  it('should be created', () => {
    expect(enrollmentService).toBeDefined();
  });

});

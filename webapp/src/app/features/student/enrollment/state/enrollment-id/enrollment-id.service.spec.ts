import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnrollmentIdService } from './enrollment-id.service';
import { EnrollmentIdStore } from './enrollment-id.store';

describe('EnrollmentIdService', () => {
  let enrollmentIdService: EnrollmentIdService;
  let enrollmentIdStore: EnrollmentIdStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnrollmentIdService, EnrollmentIdStore],
      imports: [ HttpClientTestingModule ]
    });

    enrollmentIdService = TestBed.inject(EnrollmentIdService);
    enrollmentIdStore = TestBed.inject(EnrollmentIdStore);
  });

  it('should be created', () => {
    expect(enrollmentIdService).toBeDefined();
  });

});

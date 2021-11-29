import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminCollegeService } from './admin-college.service';
import { AdminCollegeStore } from './admin-college.store';

describe('AdminCollegeService', () => {
  let adminCollegeService: AdminCollegeService;
  let adminCollegeStore: AdminCollegeStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminCollegeService, AdminCollegeStore],
      imports: [ HttpClientTestingModule ]
    });

    adminCollegeService = TestBed.inject(AdminCollegeService);
    adminCollegeStore = TestBed.inject(AdminCollegeStore);
  });

  it('should be created', () => {
    expect(adminCollegeService).toBeDefined();
  });

});

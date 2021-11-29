import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminAuthorityService } from './admin-authority.service';
import { AdminAuthorityStore } from './admin-authority.store';

describe('AdminAuthorityService', () => {
  let adminAuthorityService: AdminAuthorityService;
  let adminAuthorityStore: AdminAuthorityStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAuthorityService, AdminAuthorityStore],
      imports: [ HttpClientTestingModule ]
    });

    adminAuthorityService = TestBed.inject(AdminAuthorityService);
    adminAuthorityStore = TestBed.inject(AdminAuthorityStore);
  });

  it('should be created', () => {
    expect(adminAuthorityService).toBeDefined();
  });

});

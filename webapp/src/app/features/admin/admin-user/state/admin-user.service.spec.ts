import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminUserService } from './admin-user.service';
import { AdminUserStore } from './admin-user.store';

describe('AdminUserService', () => {
  let adminUserService: AdminUserService;
  let adminUserStore: AdminUserStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminUserService, AdminUserStore],
      imports: [ HttpClientTestingModule ]
    });

    adminUserService = TestBed.inject(AdminUserService);
    adminUserStore = TestBed.inject(AdminUserStore);
  });

  it('should be created', () => {
    expect(adminUserService).toBeDefined();
  });

});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminDepartmentService } from './admin-department.service';
import { AdminDepartmentStore } from './admin-department.store';

describe('AdminDepartmentService', () => {
  let adminDepartmentService: AdminDepartmentService;
  let adminDepartmentStore: AdminDepartmentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminDepartmentService, AdminDepartmentStore],
      imports: [ HttpClientTestingModule ]
    });

    adminDepartmentService = TestBed.inject(AdminDepartmentService);
    adminDepartmentStore = TestBed.inject(AdminDepartmentStore);
  });

  it('should be created', () => {
    expect(adminDepartmentService).toBeDefined();
  });

});

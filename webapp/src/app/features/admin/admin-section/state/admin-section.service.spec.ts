import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminSectionService } from './admin-section.service';
import { AdminSectionStore } from './admin-section.store';

describe('AdminSectionService', () => {
  let adminSectionService: AdminSectionService;
  let adminSectionStore: AdminSectionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminSectionService, AdminSectionStore],
      imports: [ HttpClientTestingModule ]
    });

    adminSectionService = TestBed.inject(AdminSectionService);
    adminSectionStore = TestBed.inject(AdminSectionStore);
  });

  it('should be created', () => {
    expect(adminSectionService).toBeDefined();
  });

});

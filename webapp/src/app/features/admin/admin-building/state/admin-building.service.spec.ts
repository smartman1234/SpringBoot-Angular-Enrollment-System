import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminBuildingService } from './admin-building.service';
import { AdminBuildingStore } from './admin-building.store';

describe('AdminBuildingService', () => {
  let adminBuildingService: AdminBuildingService;
  let adminBuildingStore: AdminBuildingStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminBuildingService, AdminBuildingStore],
      imports: [ HttpClientTestingModule ]
    });

    adminBuildingService = TestBed.inject(AdminBuildingService);
    adminBuildingStore = TestBed.inject(AdminBuildingStore);
  });

  it('should be created', () => {
    expect(adminBuildingService).toBeDefined();
  });

});

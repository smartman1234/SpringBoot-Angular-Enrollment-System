import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminTermService } from './admin-term.service';
import { AdminTermStore } from './admin-term.store';

describe('AdminTermService', () => {
  let adminTermService: AdminTermService;
  let adminTermStore: AdminTermStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminTermService, AdminTermStore],
      imports: [ HttpClientTestingModule ]
    });

    adminTermService = TestBed.inject(AdminTermService);
    adminTermStore = TestBed.inject(AdminTermStore);
  });

  it('should be created', () => {
    expect(adminTermService).toBeDefined();
  });

});

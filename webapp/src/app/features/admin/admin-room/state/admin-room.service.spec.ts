import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminRoomService } from './admin-room.service';
import { AdminRoomStore } from './admin-room.store';

describe('AdminRoomService', () => {
  let adminRoomService: AdminRoomService;
  let adminRoomStore: AdminRoomStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminRoomService, AdminRoomStore],
      imports: [ HttpClientTestingModule ]
    });

    adminRoomService = TestBed.inject(AdminRoomService);
    adminRoomStore = TestBed.inject(AdminRoomStore);
  });

  it('should be created', () => {
    expect(adminRoomService).toBeDefined();
  });

});

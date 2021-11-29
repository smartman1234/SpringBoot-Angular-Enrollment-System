import { AdminRoomStore } from './admin-room.store';

describe('AdminRoomStore', () => {
  let store: AdminRoomStore;

  beforeEach(() => {
    store = new AdminRoomStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

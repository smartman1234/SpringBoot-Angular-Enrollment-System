import { AdminRoomQuery } from './admin-room.query';
import { AdminRoomStore } from './admin-room.store';

describe('AdminRoomQuery', () => {
  let query: AdminRoomQuery;

  beforeEach(() => {
    query = new AdminRoomQuery(new AdminRoomStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

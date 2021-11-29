import { AdminUserQuery } from './admin-user.query';
import { AdminUserStore } from './admin-user.store';

describe('AdminUserQuery', () => {
  let query: AdminUserQuery;

  beforeEach(() => {
    query = new AdminUserQuery(new AdminUserStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

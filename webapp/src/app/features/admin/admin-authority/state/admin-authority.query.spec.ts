import { AdminAuthorityQuery } from './admin-authority.query';
import { AdminAuthorityStore } from './admin-authority.store';

describe('AdminAuthorityQuery', () => {
  let query: AdminAuthorityQuery;

  beforeEach(() => {
    query = new AdminAuthorityQuery(new AdminAuthorityStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

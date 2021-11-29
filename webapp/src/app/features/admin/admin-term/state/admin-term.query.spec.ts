import { AdminTermQuery } from './admin-term.query';
import { AdminTermStore } from './admin-term.store';

describe('AdminTermQuery', () => {
  let query: AdminTermQuery;

  beforeEach(() => {
    query = new AdminTermQuery(new AdminTermStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

import { AdminSectionQuery } from './admin-section.query';
import { AdminSectionStore } from './admin-section.store';

describe('AdminSectionQuery', () => {
  let query: AdminSectionQuery;

  beforeEach(() => {
    query = new AdminSectionQuery(new AdminSectionStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

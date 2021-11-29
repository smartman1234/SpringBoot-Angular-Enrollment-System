import { AdminBuildingQuery } from './admin-building.query';
import { AdminBuildingStore } from './admin-building.store';

describe('AdminBuildingQuery', () => {
  let query: AdminBuildingQuery;

  beforeEach(() => {
    query = new AdminBuildingQuery(new AdminBuildingStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

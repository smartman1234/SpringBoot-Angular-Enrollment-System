import { AdminBuildingStore } from './admin-building.store';

describe('AdminBuildingStore', () => {
  let store: AdminBuildingStore;

  beforeEach(() => {
    store = new AdminBuildingStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

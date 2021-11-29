import { AdminSectionStore } from './admin-section.store';

describe('AdminSectionStore', () => {
  let store: AdminSectionStore;

  beforeEach(() => {
    store = new AdminSectionStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

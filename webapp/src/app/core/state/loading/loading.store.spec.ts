import { LoadingStore } from './loading.store';

describe('LoadingStore', () => {
  let store: LoadingStore;

  beforeEach(() => {
    store = new LoadingStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

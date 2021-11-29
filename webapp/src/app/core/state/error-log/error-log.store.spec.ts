import { ErrorLogStore } from './error-log.store';

describe('ErrorLogStore', () => {
  let store: ErrorLogStore;

  beforeEach(() => {
    store = new ErrorLogStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

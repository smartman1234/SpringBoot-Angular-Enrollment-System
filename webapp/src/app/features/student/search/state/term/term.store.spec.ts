import { TermStore } from './term.store';

describe('TermStore', () => {
  let store: TermStore;

  beforeEach(() => {
    store = new TermStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

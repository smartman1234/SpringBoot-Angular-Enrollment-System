import { SectionStore } from './section.store';

describe('SectionStore', () => {
  let store: SectionStore;

  beforeEach(() => {
    store = new SectionStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});

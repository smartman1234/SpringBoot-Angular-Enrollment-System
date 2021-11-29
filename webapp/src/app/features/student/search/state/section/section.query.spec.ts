import { SectionQuery } from './section.query';
import { SectionStore } from './section.store';

describe('SectionQuery', () => {
  let query: SectionQuery;

  beforeEach(() => {
    query = new SectionQuery(new SectionStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

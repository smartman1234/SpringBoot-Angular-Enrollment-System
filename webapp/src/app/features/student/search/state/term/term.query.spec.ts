import { TermQuery } from './term.query';
import { TermStore } from './term.store';

describe('TermQuery', () => {
  let query: TermQuery;

  beforeEach(() => {
    query = new TermQuery(new TermStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});

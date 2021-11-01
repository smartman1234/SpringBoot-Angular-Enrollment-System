import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultSliceComponent } from './search-result-slice.component';

describe('SearchResultSliceComponent', () => {
  let component: SearchResultSliceComponent;
  let fixture: ComponentFixture<SearchResultSliceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultSliceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultSliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

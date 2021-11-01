import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAccordionComponent } from './result-accordion.component';

describe('ResultAccordionComponent', () => {
  let component: ResultAccordionComponent;
  let fixture: ComponentFixture<ResultAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

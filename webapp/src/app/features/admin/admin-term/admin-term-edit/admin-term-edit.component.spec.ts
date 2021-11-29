import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermEditComponent } from './admin-term-edit.component';

describe('AdminTermEditComponent', () => {
  let component: AdminTermEditComponent;
  let fixture: ComponentFixture<AdminTermEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTermEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

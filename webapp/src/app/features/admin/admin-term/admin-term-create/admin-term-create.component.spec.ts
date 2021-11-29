import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermCreateComponent } from './admin-term-create.component';

describe('AdminTermCreateComponent', () => {
  let component: AdminTermCreateComponent;
  let fixture: ComponentFixture<AdminTermCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTermCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

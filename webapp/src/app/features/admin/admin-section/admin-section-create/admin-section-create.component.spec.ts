import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSectionCreateComponent } from './admin-section-create.component';

describe('AdminSectionCreateComponent', () => {
  let component: AdminSectionCreateComponent;
  let fixture: ComponentFixture<AdminSectionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSectionCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSectionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

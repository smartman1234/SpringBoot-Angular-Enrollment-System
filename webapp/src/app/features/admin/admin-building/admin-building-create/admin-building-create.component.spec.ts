import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuildingCreateComponent } from './admin-building-create.component';

describe('AdminBuildingCreateComponent', () => {
  let component: AdminBuildingCreateComponent;
  let fixture: ComponentFixture<AdminBuildingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBuildingCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuildingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

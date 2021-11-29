import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuildingEditComponent } from './admin-building-edit.component';

describe('AdminBuildingEditComponent', () => {
  let component: AdminBuildingEditComponent;
  let fixture: ComponentFixture<AdminBuildingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBuildingEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuildingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

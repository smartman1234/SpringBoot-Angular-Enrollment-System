import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomCreateComponent } from './admin-room-create.component';

describe('AdminRoomCreateComponent', () => {
  let component: AdminRoomCreateComponent;
  let fixture: ComponentFixture<AdminRoomCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRoomCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

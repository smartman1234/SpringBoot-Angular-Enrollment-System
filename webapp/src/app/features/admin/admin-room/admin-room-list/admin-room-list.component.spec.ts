import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomListComponent } from './admin-room-list.component';

describe('AdminRoomListComponent', () => {
  let component: AdminRoomListComponent;
  let fixture: ComponentFixture<AdminRoomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRoomListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

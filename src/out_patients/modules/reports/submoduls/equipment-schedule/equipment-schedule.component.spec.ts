import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentScheduleComponent } from './equipment-schedule.component';

describe('EquipmentScheduleComponent', () => {
  let component: EquipmentScheduleComponent;
  let fixture: ComponentFixture<EquipmentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDateDialogComponent } from './schedule-date-dialog.component';

describe('ScheduleDateDialogComponent', () => {
  let component: ScheduleDateDialogComponent;
  let fixture: ComponentFixture<ScheduleDateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleDateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

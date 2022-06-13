import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSearchDialogComponent } from './appointment-search-dialog.component';

describe('AppointmentSearchDialogComponent', () => {
  let component: AppointmentSearchDialogComponent;
  let fixture: ComponentFixture<AppointmentSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentSearchDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

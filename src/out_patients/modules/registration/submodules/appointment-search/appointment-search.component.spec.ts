import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSearchComponent } from './appointment-search.component';

describe('AppointmentSearchComponent', () => {
  let component: AppointmentSearchComponent;
  let fixture: ComponentFixture<AppointmentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

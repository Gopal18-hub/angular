import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCheckupWarningComponent } from './health-checkup-warning.component';

describe('HealthCheckupWarningComponent', () => {
  let component: HealthCheckupWarningComponent;
  let fixture: ComponentFixture<HealthCheckupWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthCheckupWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCheckupWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

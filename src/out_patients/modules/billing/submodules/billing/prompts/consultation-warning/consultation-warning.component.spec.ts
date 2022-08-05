import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationWarningComponent } from './consultation-warning.component';

describe('ConsultationWarningComponent', () => {
  let component: ConsultationWarningComponent;
  let fixture: ComponentFixture<ConsultationWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

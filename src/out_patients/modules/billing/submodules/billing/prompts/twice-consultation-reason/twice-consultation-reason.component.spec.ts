import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwiceConsultationReasonComponent } from './twice-consultation-reason.component';

describe('TwiceConsultationReasonComponent', () => {
  let component: TwiceConsultationReasonComponent;
  let fixture: ComponentFixture<TwiceConsultationReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwiceConsultationReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwiceConsultationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

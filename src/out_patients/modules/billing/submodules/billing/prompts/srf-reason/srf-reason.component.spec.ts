import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrfReasonComponent } from './srf-reason.component';

describe('SrfReasonComponent', () => {
  let component: SrfReasonComponent;
  let fixture: ComponentFixture<SrfReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrfReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrfReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

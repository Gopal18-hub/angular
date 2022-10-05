import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscDiscountReasonComponent } from './misc-discount-reason.component';

describe('MiscDiscountReasonComponent', () => {
  let component: MiscDiscountReasonComponent;
  let fixture: ComponentFixture<MiscDiscountReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscDiscountReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscDiscountReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

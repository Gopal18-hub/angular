import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountAmtDialogComponent } from './discount-amt-dialog.component';

describe('DiscountAmtDialogComponent', () => {
  let component: DiscountAmtDialogComponent;
  let fixture: ComponentFixture<DiscountAmtDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountAmtDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountAmtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

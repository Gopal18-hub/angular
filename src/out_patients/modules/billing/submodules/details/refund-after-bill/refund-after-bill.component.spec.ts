import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundAfterBillComponent } from './refund-after-bill.component';

describe('RefundAfterBillComponent', () => {
  let component: RefundAfterBillComponent;
  let fixture: ComponentFixture<RefundAfterBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundAfterBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundAfterBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

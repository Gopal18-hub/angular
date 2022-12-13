import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmMachineComponent } from './paytm-machine.component';

describe('PaytmMachineComponent', () => {
  let component: PaytmMachineComponent;
  let fixture: ComponentFixture<PaytmMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytmMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

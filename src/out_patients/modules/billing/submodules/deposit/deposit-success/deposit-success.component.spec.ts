import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositSuccessComponent } from './deposit-success.component';

describe('DepositSuccessComponent', () => {
  let component: DepositSuccessComponent;
  let fixture: ComponentFixture<DepositSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

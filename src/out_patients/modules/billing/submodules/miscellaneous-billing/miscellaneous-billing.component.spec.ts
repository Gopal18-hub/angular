import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousBillingComponent } from './miscellaneous-billing.component';

describe('MiscellaneousBillingComponent', () => {
  let component: MiscellaneousBillingComponent;
  let fixture: ComponentFixture<MiscellaneousBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

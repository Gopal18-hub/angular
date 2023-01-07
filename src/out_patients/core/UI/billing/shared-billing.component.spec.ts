import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBillingComponent } from './shared-billing.component';

describe('SharedBillingComponent', () => {
  let component: SharedBillingComponent;
  let fixture: ComponentFixture<SharedBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

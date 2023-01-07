import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationBillingComponent } from './configuration-billing.component';

describe('ConfigurationBillingComponent', () => {
  let component: ConfigurationBillingComponent;
  let fixture: ComponentFixture<ConfigurationBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

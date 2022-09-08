import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IomCompanyBillingComponent } from './iom-company-billing.component';

describe('IomCompanyBillingComponent', () => {
  let component: IomCompanyBillingComponent;
  let fixture: ComponentFixture<IomCompanyBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IomCompanyBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IomCompanyBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

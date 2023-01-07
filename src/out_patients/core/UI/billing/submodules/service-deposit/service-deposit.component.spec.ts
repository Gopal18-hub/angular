import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDepositComponent } from './service-deposit.component';

describe('ServiceDepositComponent', () => {
  let component: ServiceDepositComponent;
  let fixture: ComponentFixture<ServiceDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateDepositComponent } from './initiate-deposit.component';

describe('InitiateDepositComponent', () => {
  let component: InitiateDepositComponent;
  let fixture: ComponentFixture<InitiateDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiateDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

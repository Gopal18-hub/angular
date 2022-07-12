import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OprefundApprovalComponent } from './oprefund-approval.component';

describe('OprefundApprovalComponent', () => {
  let component: OprefundApprovalComponent;
  let fixture: ComponentFixture<OprefundApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OprefundApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OprefundApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

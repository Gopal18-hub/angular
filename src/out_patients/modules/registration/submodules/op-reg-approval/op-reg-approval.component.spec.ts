import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpRegApprovalComponent } from './op-reg-approval.component';

describe('OpRegApprovalComponent', () => {
  let component: OpRegApprovalComponent;
  let fixture: ComponentFixture<OpRegApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpRegApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpRegApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

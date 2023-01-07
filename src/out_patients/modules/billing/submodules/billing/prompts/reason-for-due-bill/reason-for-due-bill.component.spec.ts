import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonForDueBillComponent } from './reason-for-due-bill.component';

describe('ReasonForDueBillComponent', () => {
  let component: ReasonForDueBillComponent;
  let fixture: ComponentFixture<ReasonForDueBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonForDueBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonForDueBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

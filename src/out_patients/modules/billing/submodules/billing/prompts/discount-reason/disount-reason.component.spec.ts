import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisountReasonComponent } from './disount-reason.component';

describe('DisountReasonComponent', () => {
  let component: DisountReasonComponent;
  let fixture: ComponentFixture<DisountReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisountReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisountReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

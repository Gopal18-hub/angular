import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreThanMonthComponent } from './more-than-month.component';

describe('MoreThanMonthComponent', () => {
  let component: MoreThanMonthComponent;
  let fixture: ComponentFixture<MoreThanMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreThanMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreThanMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

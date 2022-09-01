import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPlanDetilsComponent } from './show-plan-detils.component';

describe('ShowPlanDetilsComponent', () => {
  let component: ShowPlanDetilsComponent;
  let fixture: ComponentFixture<ShowPlanDetilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPlanDetilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPlanDetilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

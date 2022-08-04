import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableDetailsComponent } from './consumable-details.component';

describe('ConsumableDetailsComponent', () => {
  let component: ConsumableDetailsComponent;
  let fixture: ComponentFixture<ConsumableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumableDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

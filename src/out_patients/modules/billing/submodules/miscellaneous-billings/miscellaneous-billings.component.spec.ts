import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousBillingsComponent } from './miscellaneous-billings.component';

describe('MiscellaneousBillingsComponent', () => {
  let component: MiscellaneousBillingsComponent;
  let fixture: ComponentFixture<MiscellaneousBillingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousBillingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousBillingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

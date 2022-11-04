import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonForGxtTaxComponent } from './reason-for-gxt-tax.component';

describe('ReasonForGxtTaxComponent', () => {
  let component: ReasonForGxtTaxComponent;
  let fixture: ComponentFixture<ReasonForGxtTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonForGxtTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonForGxtTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

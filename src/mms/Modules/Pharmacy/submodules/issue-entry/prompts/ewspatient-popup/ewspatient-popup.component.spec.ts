import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EwspatientPopupComponent } from './ewspatient-popup.component';

describe('EwspatientPopupComponent', () => {
  let component: EwspatientPopupComponent;
  let fixture: ComponentFixture<EwspatientPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EwspatientPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EwspatientPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

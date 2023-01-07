import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmgOthergrpDocPopupComponent } from './dmg-othergrp-doc-popup.component';

describe('DmgOthergrpDocPopupComponent', () => {
  let component: DmgOthergrpDocPopupComponent;
  let fixture: ComponentFixture<DmgOthergrpDocPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmgOthergrpDocPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmgOthergrpDocPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

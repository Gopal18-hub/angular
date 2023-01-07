import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmgPopupComponent } from './dmg-popup.component';

describe('DmgPopupComponent', () => {
  let component: DmgPopupComponent;
  let fixture: ComponentFixture<DmgPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmgPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmgPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

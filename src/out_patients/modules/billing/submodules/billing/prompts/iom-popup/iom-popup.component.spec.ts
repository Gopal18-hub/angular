import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IomPopupComponent } from './iom-popup.component';

describe('IomPopupComponent', () => {
  let component: IomPopupComponent;
  let fixture: ComponentFixture<IomPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IomPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IomPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

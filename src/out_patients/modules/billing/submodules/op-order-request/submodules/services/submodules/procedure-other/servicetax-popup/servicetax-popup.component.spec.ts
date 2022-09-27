import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetaxPopupComponent } from './servicetax-popup.component';

describe('ServicetaxPopupComponent', () => {
  let component: ServicetaxPopupComponent;
  let fixture: ComponentFixture<ServicetaxPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetaxPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetaxPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationUnmergingComponent } from './registration-unmerging.component';

describe('RegistrationUnmergingComponent', () => {
  let component: RegistrationUnmergingComponent;
  let fixture: ComponentFixture<RegistrationUnmergingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationUnmergingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationUnmergingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

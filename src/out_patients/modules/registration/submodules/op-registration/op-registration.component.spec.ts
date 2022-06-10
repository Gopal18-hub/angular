import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpRegistrationComponent } from './op-registration.component';

describe('OpRegistrationComponent', () => {
  let component: OpRegistrationComponent;
  let fixture: ComponentFixture<OpRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

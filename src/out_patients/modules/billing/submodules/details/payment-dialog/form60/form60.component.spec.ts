import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form60Component } from './form60.component';

describe('Form60Component', () => {
  let component: Form60Component;
  let fixture: ComponentFixture<Form60Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form60Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Form60Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form60YesOrNoComponent } from './form60-yes-or-no.component';

describe('Form60YesOrNoComponent', () => {
  let component: Form60YesOrNoComponent;
  let fixture: ComponentFixture<Form60YesOrNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form60YesOrNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Form60YesOrNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

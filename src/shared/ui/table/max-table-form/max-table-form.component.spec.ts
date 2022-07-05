import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxTableFormComponent } from './max-table-form.component';

describe('MaxTableFormComponent', () => {
  let component: MaxTableFormComponent;
  let fixture: ComponentFixture<MaxTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxTableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

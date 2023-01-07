import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectimeiComponent } from './selectimei.component';

describe('SelectimeiComponent', () => {
  let component: SelectimeiComponent;
  let fixture: ComponentFixture<SelectimeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectimeiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectimeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

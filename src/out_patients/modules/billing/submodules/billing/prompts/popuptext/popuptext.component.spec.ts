import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopuptextComponent } from './popuptext.component';

describe('PopuptextComponent', () => {
  let component: PopuptextComponent;
  let fixture: ComponentFixture<PopuptextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopuptextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopuptextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

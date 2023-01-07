import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DMSComponent } from './dms.component';

describe('DMSComponent', () => {
  let component: DMSComponent;
  let fixture: ComponentFixture<DMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

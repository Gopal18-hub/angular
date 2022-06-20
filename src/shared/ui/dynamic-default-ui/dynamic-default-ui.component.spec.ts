import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDefaultUiComponent } from './dynamic-default-ui.component';

describe('DynamicDefaultUiComponent', () => {
  let component: DynamicDefaultUiComponent;
  let fixture: ComponentFixture<DynamicDefaultUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDefaultUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDefaultUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

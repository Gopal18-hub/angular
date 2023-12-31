import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyPlaceholderComponent } from './empty-placeholder.component';

describe('DynamicDefaultUiComponent', () => {
  let component: EmptyPlaceholderComponent;
  let fixture: ComponentFixture<EmptyPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

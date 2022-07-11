import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcdComponent } from './acd.component';

describe('AcdComponent', () => {
  let component: AcdComponent;
  let fixture: ComponentFixture<AcdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

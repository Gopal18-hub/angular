import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelocationComponent } from './changelocation.component';

describe('ChangelocationComponent', () => {
  let component: ChangelocationComponent;
  let fixture: ComponentFixture<ChangelocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangelocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

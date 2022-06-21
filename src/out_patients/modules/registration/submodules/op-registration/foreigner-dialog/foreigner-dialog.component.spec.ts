import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignerDialogComponent } from '../op-registration.component';

describe('ForeignerDialogComponent', () => {
  let component: ForeignerDialogComponent;
  let fixture: ComponentFixture<ForeignerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForeignerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeafarersDialogComponent } from './seafarers-dialog.component';

describe('SeafarersDialogComponent', () => {
  let component: SeafarersDialogComponent;
  let fixture: ComponentFixture<SeafarersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeafarersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeafarersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

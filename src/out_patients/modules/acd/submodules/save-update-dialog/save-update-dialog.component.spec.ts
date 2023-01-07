import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateDialogComponent } from './save-update-dialog.component';

describe('SaveUpdateDialogComponent', () => {
  let component: SaveUpdateDialogComponent;
  let fixture: ComponentFixture<SaveUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

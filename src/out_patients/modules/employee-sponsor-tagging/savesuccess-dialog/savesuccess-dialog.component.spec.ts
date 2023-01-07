import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavesuccessdialogComponent } from './savesuucess-dialog.component';

describe('SavesuccessdialogComponent', () => {
  let component: SavesuccessdialogComponent;
  let fixture: ComponentFixture<SavesuccessdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavesuccessdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavesuccessdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

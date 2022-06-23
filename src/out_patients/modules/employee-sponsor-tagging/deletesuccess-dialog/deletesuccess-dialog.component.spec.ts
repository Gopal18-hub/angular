import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletesuccessdialogComponent } from './deletesuccess-dialog.component';

describe('DeletesuccessdialogComponent', () => {
  let component: DeletesuccessdialogComponent;
  let fixture: ComponentFixture<DeletesuccessdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletesuccessdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletesuccessdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

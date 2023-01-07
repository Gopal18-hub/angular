import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationWarningComponent } from './investigation-warning.component';

describe('InvestigationWarningComponent', () => {
  let component: InvestigationWarningComponent;
  let fixture: ComponentFixture<InvestigationWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

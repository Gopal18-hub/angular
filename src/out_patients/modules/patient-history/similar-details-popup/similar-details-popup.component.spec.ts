import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarDetailsPopupComponent } from './similar-details-popup.component';

describe('SimilarDetailsPopupComponent', () => {
  let component: SimilarDetailsPopupComponent;
  let fixture: ComponentFixture<SimilarDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimilarDetailsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

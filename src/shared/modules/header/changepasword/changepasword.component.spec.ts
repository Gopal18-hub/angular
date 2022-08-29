import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepaswordComponent } from './changepasword.component';

describe('ChangepaswordComponent', () => {
  let component: ChangepaswordComponent;
  let fixture: ComponentFixture<ChangepaswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangepaswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangepaswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

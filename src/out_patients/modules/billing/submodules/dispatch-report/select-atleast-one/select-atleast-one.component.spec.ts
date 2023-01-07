import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAtleastOneComponent } from './select-atleast-one.component';

describe('SelectAtleastOneComponent', () => {
  let component: SelectAtleastOneComponent;
  let fixture: ComponentFixture<SelectAtleastOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAtleastOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAtleastOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

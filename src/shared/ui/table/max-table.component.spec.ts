import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxTableComponent } from './max-table.component';

describe('MaxTableComponent', () => {
  let component: MaxTableComponent;
  let fixture: ComponentFixture<MaxTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

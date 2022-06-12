import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DupRegMergingComponent } from './dup-reg-merging.component';

describe('DupRegMergingComponent', () => {
  let component: DupRegMergingComponent;
  let fixture: ComponentFixture<DupRegMergingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DupRegMergingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DupRegMergingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

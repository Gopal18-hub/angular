import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmgMappingComponent } from './dmg-mapping.component';

describe('DmgMappingComponent', () => {
  let component: DmgMappingComponent;
  let fixture: ComponentFixture<DmgMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmgMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmgMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

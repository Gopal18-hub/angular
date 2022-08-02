import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDischargeServicesComponent } from './post-discharge-services.component';

describe('PostDischargeServicesComponent', () => {
  let component: PostDischargeServicesComponent;
  let fixture: ComponentFixture<PostDischargeServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostDischargeServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDischargeServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

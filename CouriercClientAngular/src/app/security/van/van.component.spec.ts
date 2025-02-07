import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanComponent } from './van.component';

describe('VanComponent', () => {
  let component: VanComponent;
  let fixture: ComponentFixture<VanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

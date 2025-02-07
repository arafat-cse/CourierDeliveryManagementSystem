import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTypeComponent } from './parcel-type.component';

describe('ParcelTypeComponent', () => {
  let component: ParcelTypeComponent;
  let fixture: ComponentFixture<ParcelTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

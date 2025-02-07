import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChargeComponent } from './delivery-charge.component';

describe('DeliveryChargeComponent', () => {
  let component: DeliveryChargeComponent;
  let fixture: ComponentFixture<DeliveryChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryChargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// delivery-charge.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-delivery-charge',
  templateUrl: './delivery-charge.component.html',
  styleUrls: ['./delivery-charge.component.css']
})
export class DeliveryChargeComponent implements OnInit {
  listParcelType: any[] = []; // ParcelType list for dropdown
  selectedParcelTypeId: number = 0; // Selected ParcelTypeId for delivery charge
  selectedWeight: number = 0; // Selected weight for price calculation
  calculatedPrice: number = 0; // Price calculated based on weight
  weightList: number[] = [1, 2, 5, 10, 20]; // Example weight options (in KG)

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadParcelTypes();
  }

  // Load ParcelType data for dropdown
  loadParcelTypes(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || ''
    });

    this.httpClient.get<any[]>(`${this.authService.baseURL}/api/ParcelTypes`, { headers })
      .subscribe({
        next: (response) => {
          this.listParcelType = response; // Assign API response to dropdown
        },
        error: () => {
          console.error('Failed to load Parcel Types');
        }
      });
  }

  // Calculate price based on selected weight and parcel type
  // calculatePrice(): void {
  //   if (this.selectedParcelTypeId && this.selectedWeight) {
  //     // Logic to calculate price (example)
  //     this.calculatedPrice = this.selectedWeight * 50; // 50 is an example rate per KG
  //   } else {
  //     this.calculatedPrice = 0;
  //   }
  // }

  // Save delivery charge data
  saveDeliveryCharge(): void {
    const payload = {
      parcelTypeId: this.selectedParcelTypeId,
      weight: this.selectedWeight,
      price: this.calculatedPrice
    };

    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
      'Content-Type': 'application/json'
    });

    this.httpClient.post(`${this.authService.baseURL}/api/DeliveryCharges`, payload, { headers })
      .subscribe({
        next: () => {
          alert('Delivery charge saved successfully');
          this.resetForm();
        },
        error: (error) => {
          console.error('Failed to save delivery charge', error);
        }
      });
  }

  // Navigate to the next page
  goToNextPage(): void {
    this.router.navigate(['/next-page']); // Replace '/next-page' with your actual route
  }

  // Reset form fields
  resetForm(): void {
    this.selectedParcelTypeId = 0;
    this.selectedWeight = 0;
    this.calculatedPrice = 0;
  }
  

  calculatePrice(): void {
    const basePrice = 50; // Base delivery charge
    const pricePerKg = 20; // Price per KG
  
    if (this.selectedWeight && this.selectedWeight > 0) {
      this.calculatedPrice = basePrice + this.selectedWeight * pricePerKg;
    } else {
      this.calculatedPrice = basePrice; // Default delivery charge if no weight selected
    }
  }
  
}

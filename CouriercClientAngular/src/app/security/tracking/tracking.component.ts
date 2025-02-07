import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tracking',
  standalone:true,
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css',
  imports: [FormsModule, CommonModule]
})
export class TrackingComponent implements OnInit{
  
  trackingCode: string = '';
  selectedParcel: any = null;
  Allparcels:any[]=[];
 constructor(
    private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {   
    // http://localhost:5041/api/Tracking
    this.httpClient
      .get<any>(`${this.authService.baseURL}/api/Tracking`)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.Allparcels=response;
          // this.Listparcels = response;
          //  this.rowCount = response.totalCount || 0;
          // this.applyPaging();
        },
        error: () => {
          // this.showMessage('error', 'Failed to load parcel ');
        },
      });

  }
  parcels = [
    { 
      trackingCode: '123ABC', 
      sendingBranch: true, 
      percelSendingDestribution: true, 
      recebingDistributin: true, 
      recebingBranch: true, 
      recebingReceber: true 
    },
    { 
      trackingCode: '456DEF', 
      sendingBranch: true, 
      percelSendingDestribution: true, 
      recebingDistributin: false, 
      recebingBranch: false, 
      recebingReceber: false 
    }
  ];

  searchParcel() {
    // this.Allparcels.forEach(element => {
    //   console.log(element);
    // });
    this.selectedParcel = this.Allparcels.find(p => p.trackingCode === this.trackingCode);
    console.log(this.selectedParcel);
    if (!this.selectedParcel) {
      alert('Tracking Code Not Found!');
    }
    // trackingCode: "98888110"
    // this.selectedParcel = this.parcels.find(p => p.trackingCode === this.trackingCode);
    // if (!this.selectedParcel) {
    //   alert('Tracking Code Not Found!');
    // }
  }
}
// import { Component, Input } from '@angular/core';
// import { Parcel } from '../interface/parcels';

// @Component({
//   selector: 'app-tracking',
//   templateUrl: './tracking.component.html',
//   styleUrls: ['./tracking.component.css']
// })
// export class TrackingComponent {
//   @Input() parcel: Parcel[] = [];  // Parent থেকে Parcel Data আসবে
//   trackingCode: string = '';
//   selectedParcel: Parcel | null = null;

//   searchParcel() {
//     console.log(this.trackingCode);
//     this.selectedParcel = this.parcel.find(p => p.trackingCode === this.trackingCode) || null;
//     console.log(this.selectedParcel);
//     if (!this.selectedParcel) {
//       alert('❌ Tracking Code Not Found!');
//     }
//   }
// }

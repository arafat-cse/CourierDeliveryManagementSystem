

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { map, Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { AuthService } from '../auth/auth.service';
import { Staff } from '../security/interface/listStaff';
import { Van } from '../security/interface/van';
import { Branch } from '../security/interface/listBranchs';
import { Parcels } from '../security/interface/parcel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //staff interface
  listOfStaff: Staff[] = [];
  listOfVan: Van[] = [];
  listOfBranch: Branch[] = [];
  listOfParcel: Parcels[] = [];



  recentRides = [
    {
      id: 'ST747487459',
      rider: 'Randy Aminoff',
      driver: 'Jaylon Carder',
      location: 'Location 1 with complete address',
      date: '12 May 2021, 5:45',
      fare: '$453',
    },
    {
      id: 'ST847123456',
      rider: 'Alice Brown',
      driver: 'Michael Lee',
      location: 'Location 2 with complete address',
      date: '15 May 2021, 3:20',
      fare: '$275',
    },
  ];

  constructor(
    private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Register Chart.js components
    Chart.register(...registerables);
    this.getStaff();
    this.getVan();
    this.getBranches();
    this.getParcel();
    const a = setInterval(() => {
      this.loadCharts();
      clearInterval(a);
    }, 1000);
  }



  // --------------------------------------------------------- Staff Start--------------------------------------
  getStaff(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    this.httpClient
      .get<any>(`${this.authService.baseURL}/api/Staffs`, { headers })
      .subscribe({
        next: (response) => {
          this.listOfStaff = response;
          console.log(this.listOfStaff.length);


        },

      });
  }
  // --------------------------------------------------------- Staff End--------------------------------------
  // --------------------------------------------------------- Van Start--------------------------------------
  getVan(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    this.httpClient
      .get<any>(`${this.authService.baseURL}/api/Vans`, { headers })
      .subscribe({
        next: (response) => {
          this.listOfVan = response;
          console.log(this.listOfVan.length);

        },

      });
  }

  // --------------------------------------------------------- Van End--------------------------------------
  // --------------------------------------------------------- Branch Start--------------------------------------
  getBranches(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    this.httpClient
      .get<{ status: boolean; message: string; content: Branch[] }>(
        `${this.authService.baseURL}/api/Branches`,
        { headers }
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.listOfBranch = response.content;
            console.log(this.listOfBranch.length);

  
          }
        },

      });
  }
  // --------------------------------------------------------- Brnach End--------------------------------------
  // --------------------------------------------------------- Parcel Start--------------------------------------
  getParcel(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });
    this.httpClient
      .get<any>(`${this.authService.baseURL}/api/Parcels`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.listOfParcel = response;
          console.log(this.listOfParcel.length);


        },

      });
  }

  totalRevenue(): number {
    return this.listOfParcel.reduce(
      (sum, parcel) => sum + (parcel.price || 0),
      0
    );
  }

 
  completeDelevery(): number {
    return this.listOfParcel.filter(
      (parcel) =>
        parcel.sendingBranch &&
        parcel.percelSendingDestribution &&
        parcel.recebingDistributin &&
        parcel.recebingBranch &&
        parcel.recebingReceber
    ).length;
  }
  
  panddingDelevery(): number {
    return this.listOfParcel.filter(
      (parcel) =>
        // If any of the fields are missing or incomplete (not 'yes' or null)
        (parcel.sendingBranch &&
          parcel.percelSendingDestribution &&
          parcel.recebingDistributin &&
          parcel.recebingBranch &&
          parcel.recebingReceber) === false
        ||
        // Or if any of the fields are 'yes' or have a value
        !(
          parcel.sendingBranch &&
          parcel.percelSendingDestribution &&
          parcel.recebingDistributin &&
          parcel.recebingBranch &&
          parcel.recebingReceber
        )
    ).length;
  }




  loadCharts(): void {
    const rideCtx = document.getElementById('rideChart') as HTMLCanvasElement;

const rideChart = new Chart(rideCtx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Delivery',
        data: [800, 1500, 1200, 2000, 1800, 900, 1300, 1700, 1500],
        borderColor: 'green',
        tension: 0.4,
        fill: false,
      },
    ],
  },
  options: {
    responsive: false, 
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  },
});

    const driverCtx = document.getElementById('driverChart') as HTMLCanvasElement;

    const driverChart = new Chart(driverCtx, {
      type: 'doughnut',
      data: {
        labels: ['Parcel', 'On Delivery', 'Complete'],
        datasets: [
          {
            data: [
              this.listOfParcel.length,
              this.panddingDelevery(),
              this.completeDelevery(),
            ],
            backgroundColor: ['#22B363FF', '#ffc107', '#007bff'],
          },
        ],
      },
      options: {
        responsive: false, 
        maintainAspectRatio: false, 
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });    
  }

  // --------------------------------------------------------- Parcel End--------------------------------------
}

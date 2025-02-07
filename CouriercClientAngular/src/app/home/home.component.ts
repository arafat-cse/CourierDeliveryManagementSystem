import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { TrackingComponent } from '../security/tracking/tracking.component';
import { CommonModule } from '@angular/common';
import { Branch } from '../security/interface/listBranchs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TrackingComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  // listBranchs: Branch[] = [];


 constructor(private authService: AuthService, 
  private router: Router, 
  private cs:CommonService,
  private httpClient: HttpClient,
  private app:AppComponent) {
      this.router.navigate(['/home']);
    }

    listbranches = [
      { id: 1, name: 'Dhaka Branch', address: 'Gulshan-1, Dhaka', phone: '+8801712345678' },
      { id: 2, name: 'Chittagong Branch', address: 'Agrabad, Chittagong', phone: '+8801812345678' },
      { id: 3, name: 'Rajshahi Branch', address: 'Shaheb Bazar, Rajshahi', phone: '+8801912345678' },
      { id: 4, name: 'Khulna Branch', address: 'Shibbari, Khulna', phone: '+8801712345679' },
      { id: 5, name: 'Sylhet Branch', address: 'Zindabazar, Sylhet', phone: '+8801712345680' },
      { id: 6, name: 'Barisal Branch', address: 'Band Road, Barisal', phone: '+8801712345681' },
      { id: 7, name: 'Rangpur Branch', address: 'Station Road, Rangpur', phone: '+8801712345682' },
      { id: 8, name: 'Mymensingh Branch', address: 'Town Hall, Mymensingh', phone: '+8801712345683' },
      { id: 9, name: 'Comilla Branch', address: 'Kandirpar, Comilla', phone: '+8801712345684' },
      { id: 10, name: 'Jessore Branch', address: 'Railway Station, Jessore', phone: '+8801712345685' },
      { id: 11, name: 'Bogura Branch', address: 'Satmatha, Bogura', phone: '+8801712345686' },
      { id: 12, name: 'Narayanganj Branch', address: 'Chashara, Narayanganj', phone: '+8801712345687' },
      { id: 13, name: 'Gazipur Branch', address: 'Chowrasta, Gazipur', phone: '+8801712345688' },
      { id: 14, name: 'Tangail Branch', address: 'Court Road, Tangail', phone: '+8801712345689' },
      { id: 15, name: 'Faridpur Branch', address: 'Goalchamot, Faridpur', phone: '+8801712345690' },
      { id: 16, name: 'Feni Branch', address: 'Trunk Road, Feni', phone: '+8801712345691' },
      { id: 17, name: 'Bagerhat Branch', address: 'Shatgumbad, Bagerhat', phone: '+8801712345692' },
      { id: 18, name: 'Kushtia Branch', address: 'Mill Para, Kushtia', phone: '+8801712345693' },
      { id: 19, name: 'Noakhali Branch', address: 'Maijdee, Noakhali', phone: '+8801712345694' },
      { id: 20, name: 'Pabna Branch', address: 'Edward College, Pabna', phone: '+8801712345695' }
    ];
  ngOnInit(): void {
    // this.getBranches()
  }

    isModalOpen = true;

    // Fetch branches from API
  //     getBranches(): void {
  //       this.httpClient.get<any>(`${this.authService.baseURL}/api/Branches`,
  //       ).subscribe({
  //         next: (response) => {
  //           if (response) {
  //             this.listBranchs = response;
            
              
  //        console.log(this.listBranchs)
  //         }
  //       }
  //       });
  //     }
   
   }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';
interface Vans{
  vanId:number;
  registrationNo:string;
  createBy?: string;
  createDate?: Date | null;
  updateBy?: string;
  updateDate?: Date | null;
  isActive: boolean;
}



@Component({
  selector: 'app-van',
  templateUrl: './van.component.html',
  styleUrl: './van.component.css'
})
export class VanComponent implements OnInit{

    // Display control
    isList: boolean = true;
    isNew: boolean = true;
    
        // Toast notification
        toast!: toastPayload;
        listVans:Vans[]=[];
        van$:Vans={
          vanId:0,
          registrationNo:'',
          createBy: '',
          createDate: null,
          updateBy: '',
          updateDate: null,
          isActive: true,
        };
        
  // Pagination
  pageIndex: number = 0;
  pageSize: number = 10;
  rowCount: number = 0;
  listPageSize: number[] = [5, 10, 20];
  pageStart: number = 0;
  pageEnd: number = 0;
  totalRowsInList: number = 0;
  pagedItems: any[] = [];
  pager: {
    pages: number[];
    totalPages: number;
  } = {
    pages: [],
    totalPages: 0
  };
  constructor( private cs: CommonService, private httpClient:HttpClient,  public authService: AuthService)
  {}
  ngOnInit(): void {
    this.getVan();
  }
  getVan(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.get<any>(`${this.authService.baseURL}/api/Vans`, { headers })
      .subscribe({
        next: (response) => {
          this.listVans = response;
        //  this.rowCount = response.totalCount || 0;
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load Vans');
        },
      });
  }

    edit(item: Vans): void {
      this.van$ = {
        vanId: item.vanId,
        registrationNo: item.registrationNo,
        updateBy:item.createBy,
        isActive: item.isActive
      };
      this.isList = false;
    }
     
    add(): void {
      if (!this.validateForm()) {
        return;
      }
    
      const headers = new HttpHeaders({
        'Token': this.authService.UserInfo?.Token,
        'Content-Type': 'application/json',
      });
    
      const payload = {
        ...this.van$, // Include all necessary properties for a new parcel type
      };
    
      this.httpClient.post(
        `${this.authService.baseURL}/api/Vans`,
        payload,
        { headers }
      ).subscribe({
        next: () => {
          this.isList = true;
          this.reset();
          this.getVan();
          this.showMessage('success', 'Van added successfully');
  
        },
        error: (error) => {
          this.showMessage('error', error.error || 'Failed to add Van');
        },
      });
    }
  
    update(): void {
      if (!this.validateForm()) {
        return;
      }
    
      const headers = new HttpHeaders({
        'Token': this.authService.UserInfo?.Token,
      });
  
      console.log(this.van$)
    
      const payload = {
        vanId: this.van$.vanId,
        registrationNo: this.van$.registrationNo,  
        updateby:this.van$.updateBy,    
        isActive: this.van$.isActive, // No conversion needed
      };
      // const payload = { ...this.designation };
      console.log(payload);
    
      this.httpClient.put(
        `${this.authService.baseURL}/api/Vans/${this.van$.vanId}`,
        payload,
        { headers }
      ).subscribe({
      
        next: () => {
          this.isList = true;
          this.getVan();
          this.showMessage('success', 'Van updated successfully');
          console.log(payload);
          console.log(this.van$.registrationNo,  )
        },
        error: (error) => {
          this.showMessage('error', error.error || 'Failed to update Van');
        },
      });
    }
  
    removeConfirm(parcel: Vans): void {
      this.van$ = { ...parcel };
  
    }
  
    remove(vans: Vans): void {
      const headers = new HttpHeaders({
        'Token': this.authService.UserInfo?.Token || '',
      });
  
      this.httpClient.delete(`${this.authService.baseURL}/api/Vans/${vans.vanId}`, { headers })
        .subscribe({
          next: () => {
            this.reset();
            this.getVan();
            this.showMessage('success', 'Vans deleted successfully');
          },
          error: () => {
            this.showMessage('error', 'Failed to delete Vans');
          },
        });
    }
  
    reset(): void {
      this.van$ = {
        vanId: 0,
        registrationNo:'',
        createBy: '',
        createDate: null,
        updateBy: '',
        updateDate: null,
        isActive: true,
      };
    }
  
   validateForm(): boolean {
      if (!this.van$.registrationNo.trim()) {
        this.showMessage('warning', 'Vans name is required');
        return false;
      }
      return true;
    }





showMessage(type: string, message: string): void {
    this.toast = {
      message: message,
      title: type.toUpperCase(),
      type: type,
      ic: {
        timeOut: 2500,
        closeButton: true,
      } as IndividualConfig,
    };
    this.cs.showToast(this.toast);
  }

  applyPaging(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.listVans.slice(start, end);
    this.calculatePages();
  }

  calculatePages(): void {
    this.pager.totalPages = Math.ceil(this.rowCount / this.pageSize);
    this.pager.pages = Array.from(Array(this.pager.totalPages).keys());
  }

  changePageSize(): void {
    this.pageIndex = 0;
    this.applyPaging();
  }

  changePageNumber(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.applyPaging();
  }
  search(): void {
    this.applyPaging();
  }
// ---------------------------------active inActive --------------------------
 toggleVan(vans: Vans): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    const updatedStatus = {
      ...vans,
      isActive: !vans.isActive, // বর্তমান isActive মানটি উল্টানো হবে
    };

    this.httpClient.put(
      `${this.authService.baseURL}/api/Vans/${vans.vanId}`,
      updatedStatus,
      { headers }
    ).subscribe({
      next: () => {
        vans.isActive = !vans.isActive; // UI আপডেট করুন
        this.showMessage(
          'success',
          `Status changed to ${vans.isActive ? 'Active' : 'Inactive'}`
        );
      },
      error: () => {
        this.showMessage('error', 'Failed to change status');
      },
    });
  }
  

}


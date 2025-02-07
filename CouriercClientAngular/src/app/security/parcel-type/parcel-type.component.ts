import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';


interface ParcelType {
  parcelTypeId: number;
  parcelTypeName: string;
  defaultPrice:number;
  createBy?: string;
  createDate?: Date | null;
  updateBy?: string;
  updateDate?: Date | null;
  isActive: boolean;
}

@Component({
  selector: 'app-parcel-type',
  templateUrl: './parcel-type.component.html',
  styleUrls: ['./parcel-type.component.css']
})
export class ParcelTypeComponent implements OnInit {
  // Display control
  isList: boolean = true;
  isNew: boolean = true;

  // Toast notification
  toast!: toastPayload;
  // Parcel Type data
  listParcelType: ParcelType[] = [];
  parcelType: ParcelType = {
    parcelTypeId: 0,
    parcelTypeName: '',
    defaultPrice:0,
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

  constructor(
    private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.get<any>(`${this.authService.baseURL}/api/ParcelTypes`, { headers })
      .subscribe({
        next: (response) => {
          this.listParcelType = response;
        //  this.rowCount = response.totalCount || 0;
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load parcel types');
        },
      });
  }
  
edit(item: ParcelType): void {
  this.parcelType = {
    parcelTypeId: item.parcelTypeId,
    parcelTypeName: item.parcelTypeName,
    defaultPrice:item.defaultPrice,
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
      ...this.parcelType, // Include all necessary properties for a new parcel type
    };
  
    this.httpClient.post(
      `${this.authService.baseURL}/api/ParcelTypes`,
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.reset();
        this.get();
        this.showMessage('success', 'Parcel type added successfully');
      },
      error: (error) => {
        this.showMessage('error', error.error || 'Failed to add parcel type');
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

    console.log(this.parcelType)
  
    const payload = {
      parcelTypeId: this.parcelType.parcelTypeId,
      parcelTypeName: this.parcelType.parcelTypeName,
      isActive: this.parcelType.isActive, // No conversion needed
    };
  
    console.log(payload);
  
    this.httpClient.put(
      `${this.authService.baseURL}/api/ParcelTypes/${this.parcelType.parcelTypeId}`,
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.isList = true;
        this.get();
        this.showMessage('success', 'Parcel type updated successfully');
      },
      error: (error) => {
        this.showMessage('error', error.error || 'Failed to update parcel type');
      },
    });
  }
  
  
  
  // update(): void {
  //   if (!this.validateForm()) {
  //     return;
  //   }
  
  //   const headers = new HttpHeaders({
  //     'Token': this.authService.UserInfo?.Token
  //     //'Content-Type': 'application/json',
  //   });
  
  //   const payload = {
  //     // ...this.parcelType
  //     "parcelTypeId": this.parcelType.parcelTypeId,
  //     "parcelTypeName": this.parcelType.parcelTypeName,
  //     "isActive":  this.parcelType.isActive === 'true' || this.parcelType.isActive === true,
       
  //   };
  //   console.log(payload);
  
  //   this.httpClient.put(
  //     `${this.authService.baseURL}/api/ParcelTypes/${this.parcelType.parcelTypeId}`,
  //   payload,
  //     { headers }
  //   ).subscribe({
  //     next: () => {
  //       //this.reset();
  //       this.isList=true;
  //       this.get();
  //       this.showMessage('success', 'Parcel type updated successfully');
  //     },
  //     error: (error) => {
  //       this.showMessage('error', error.error || 'Failed to update parcel type');
  //     },
  //   });
  // }
  
  removeConfirm(parcel: ParcelType): void {
    this.parcelType = { ...parcel };

  }

  remove(parcelTypeId: ParcelType): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.delete(`${this.authService.baseURL}/api/ParcelTypes/${parcelTypeId.parcelTypeId}`, { headers })
      .subscribe({
        next: () => {
          this.reset();
          this.get();
          this.showMessage('success', 'Parcel type deleted successfully');
        },
        error: () => {
          this.showMessage('error', 'Failed to delete parcel type');
        },
      });
  }

  reset(): void {
    this.parcelType = {
      parcelTypeId: 0,
      parcelTypeName: '',
      defaultPrice:0,
      // createBy: '',
      // createDate: null,
      // updateBy: '',
      // updateDate: null,
      isActive: true,
    };
  }

  validateForm(): boolean {
    if (!this.parcelType.parcelTypeName.trim()) {
      this.showMessage('warning', 'Parcel type name is required');
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
    this.pagedItems = this.listParcelType.slice(start, end);
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
  
  toggleActive(parcelType: ParcelType): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });
  
    const updatedStatus = {
      ...parcelType,
      isActive: !parcelType.isActive, // বর্তমান isActive মানটি উল্টানো হবে
    };
  
    this.httpClient.put(
      `${this.authService.baseURL}/api/ParcelTypes/${parcelType.parcelTypeId}`,
      updatedStatus,
      { headers }
    ).subscribe({
      next: () => {
        parcelType.isActive = !parcelType.isActive; // UI আপডেট করুন
        this.showMessage(
          'success',
          `Status changed to ${parcelType.isActive ? 'Active' : 'Inactive'}`
        );
      },
      error: () => {
        this.showMessage('error', 'Failed to change status');
      },
    });
  }
}

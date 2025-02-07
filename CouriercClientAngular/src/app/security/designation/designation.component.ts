import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';


interface Designation {
  designationId: number;
  title: string;
  salaryRange?: string;
  createBy?: string;
  createDate?: Date | null;
  updateBy?: string;
  updateDate?: Date | null;
  isActive: boolean;
}
@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
})
export class DesignationComponent implements OnInit {
  // Display control
    isList: boolean = true;
    isNew: boolean = true;
  
    // Toast notification
    toast!: toastPayload;
  // Parcel Type data
  listDesignation: Designation[] = [];
  designation: Designation = {
    designationId: 0,
    title: '',
    salaryRange: '',
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
  // get(): void {
  //   const headers = new HttpHeaders({
  //     'Token': this.authService.UserInfo?.Token || '',
  //   });

  //   this.httpClient.get<any>(`${this.authService.baseURL}/api/Designations`, { headers })
  //     .subscribe({
  //       next: (response) => {
  //         this.listDesignation = response;
  //       //  this.rowCount = response.totalCount || 0;
  //         this.applyPaging();
  //       },
  //       error: () => {
  //         this.showMessage('error', 'Failed to load parcel types');
  //       },
  //     });
  // }

  get(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.get<any>(`${this.authService.baseURL}/api/Designations`, { headers })
      .subscribe({
        next: (response) => {
          this.listDesignation = response;
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load designations');
        },
      });
  }


  edit(item: Designation): void {
    this.designation = {
      designationId: item.designationId,
      title: item.title,
      salaryRange:item.salaryRange,
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
      ...this.designation, // Include all necessary properties for a new parcel type
    };
  
    this.httpClient.post(
      `${this.authService.baseURL}/api/Designations`,
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.isList = true;
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

    console.log(this.designation)
  
    const payload = {
      designationId: this.designation.designationId,
      title: this.designation.title,
      salaryRange: this.designation.salaryRange,
      isActive: this.designation.isActive, // No conversion needed
    };
    // const payload = { ...this.designation };
    console.log(payload);
  
    this.httpClient.put(
      `${this.authService.baseURL}/api/Designations/${this.designation.designationId}`,
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

  removeConfirm(parcel: Designation): void {
    this.designation = { ...parcel };

  }

  remove(designation: Designation): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.delete(`${this.authService.baseURL}/api/Designations/${designation.designationId}`, { headers })
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
    this.designation = {
      designationId: 0,
      title: '',
      salaryRange:'',
      // createBy: '',
      // createDate: null,
      // updateBy: '',
      // updateDate: null,
      isActive: true,
    };
  }

 validateForm(): boolean {
    if (!this.designation.title.trim()) {
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
    this.pagedItems = this.listDesignation.slice(start, end);
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

toggleActive(designation: Designation): void {
  const headers = new HttpHeaders({
    'Token': this.authService.UserInfo?.Token || '',
  });

  const updatedStatus = {
    ...designation,
    isActive: !designation.isActive, // বর্তমান isActive মানটি উল্টানো হবে
  };

  this.httpClient.put(
    `${this.authService.baseURL}/api/Designations/${designation.designationId}`,
    updatedStatus,
    { headers }
  ).subscribe({
    next: () => {
      designation.isActive = !designation.isActive; // UI আপডেট করুন
      this.showMessage(
        'success',
        `Status changed to ${designation.isActive ? 'Active' : 'Inactive'}`
      );
    },
    error: () => {
      this.showMessage('error', 'Failed to change status');
    },
  });
}
}

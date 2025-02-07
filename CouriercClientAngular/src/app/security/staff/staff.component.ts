import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';
import { Branch } from '../interface/listBranchs';
import { Designation } from '../interface/designation';

interface Staff{
  staffId:number;
  staffName: string;
  email: string;
  staffPhone: string;
  designationId: number|null;
  branchId: number|null;
  createBy?: string;
  createDate?: Date | null;
  updateBy?: string;
  updateDate?: Date | null;
  isActive: boolean;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit{

   // Display control
   isList: boolean = true;
   isNew: boolean = true;
   
     // Toast notification
     toast!: toastPayload;
    //  Dropdwon Option list 
    listBranchs: Branch[] = [];
    listDesignation: Designation[] = [];

     listStaff:Staff[] = [];
     staff$:Staff ={
      staffId:0,
      staffName: '',
      email: '',
      staffPhone: '',
      designationId: null,
      branchId: null,
      createBy: '',
      createDate: null,
      updateBy: '',
      updateDate: null,
      isActive: true,
      
     }
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
          this.getStaff();
          this.getBranches();
          this.getDesignation()
        }
        getStaff(): void {
            const headers = new HttpHeaders({
              'Token': this.authService.UserInfo?.Token || '',
            });
        
            this.httpClient.get<any>(`${this.authService.baseURL}/api/Staffs`, { headers })
              .subscribe({
                next: (response) => {
                  this.listStaff = response;
                  console.log(response)
                //  this.rowCount = response.totalCount || 0;
                  this.applyPaging();
                },
                error: () => {
                  this.showMessage('error', 'Failed to load parcel types');
                },
              });
          }

// -----------------------------

edit(item: Staff): void {
  this.staff$ = {
    staffId: item.staffId,
    staffName: item.staffName,
    email:item.email,
    staffPhone:item.staffPhone,
    designationId: item.designationId,
    branchId: item.branchId,
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
      ...this.staff$, // Include all necessary properties for a new parcel type
    };
  
    console.log(payload)
    this.httpClient.post(
      `${this.authService.baseURL}/api/Staffs`,
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.isList = true;
        this.reset();
        this.getStaff();
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

    console.log(this.staff$)
  
    const payload = {
      staffId: this.staff$.staffId,
      staffName: this.staff$.staffName,
      email:this.staff$.email,
      staffPhone:this.staff$.staffPhone,
      designationId:this.staff$.designationId,
      branchId:this.staff$.branchId,
      isActive: this.staff$.isActive, // No conversion needed
    };
  
    console.log(payload);
  
    this.httpClient.put(
      `${this.authService.baseURL}/api/Staffs/${this.staff$.staffId}`,
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.isList = true;
        this.getStaff();
        this.showMessage('success', 'Parcel type updated successfully');
      },
      error: (error) => {
        this.showMessage('error', error.error || 'Failed to update parcel type');
      },
    });
  }
  // -------------------------------------Designation---------------------------------------
  getDesignation(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.get<any>(`${this.authService.baseURL}/api/Designations`, { headers })
      .subscribe({
        next: (response) => {
          this.listDesignation = response;
        //  this.rowCount = response.totalCount || 0;
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load parcel types');
        },
      });
  }
  getDesignationTitle(designationId: number | null): string {
    if (designationId === null) return 'N/A';
    const designation = this.listDesignation.find(d => d.designationId === designationId);
    return designation ? designation.title : 'Unknown';
  }
  // -------------------------------------Designation---------------------------------------



  // -------------------------------------Branch---------------------------------------
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
            if (response.content) this.listBranchs = response.content;
            console.log(response.content);
            // this.rowCount = response.content.length;
            // this.paginate();
            // this.prepareDropdownBranches(response.content);
          } else {
            this.showMessage('warning', response.message);
          }
        },
        error: () => {
          this.showMessage('error', 'Failed to load branches');
        },
      });
  }

    // Get branch name by ID
    getBranchName(branchId: number | null): string {
      if (branchId === null) return 'N/A';
      const branch = this.listBranchs.find(b => b.branchId === branchId);
      return branch ? branch.branchName : 'Unknown';
    }
  // -------------------------------------Branch---------------------------------------


  // -------------------------------------Branch---------------------------------------
  // -------------------------------------Branch---------------------------------------

  removeConfirm(staffs: Staff): void {
    this.staff$ = { ...staffs };
  }
  remove(staffId: Staff): void {
      const headers = new HttpHeaders({
        'Token': this.authService.UserInfo?.Token || '',
      });

      this.httpClient.delete(`${this.authService.baseURL}/api/Staffs/${staffId.staffId}`, { headers })
        .subscribe({
          next: () => {
            this.reset();
            this.getStaff();
            this.showMessage('success', 'staffs  deleted successfully');
          },
          error: () => {
            this.showMessage('error', 'Failed to delete staffs ');
          },
        });
    }
    
      reset(): void {
        this.staff$ = {
          staffId:0,
          staffName: '',
          email: '',
          staffPhone: '',
          designationId: null,
          branchId: null,
          createBy: '',
          createDate: null,
          updateBy: '',
          updateDate: null,
          isActive: true,
        };
      }
    
      validateForm(): boolean {
        if (!this.staff$.staffName.trim()) {
          this.showMessage('warning', 'staffs name is required');
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
    
       // Pagination logic
  paginate(): void {
    const start = this.pageIndex * this.pageSize;
    this.pagedItems = this.listStaff.slice(start, start + this.pageSize);
    console.log(this.pagedItems)
    console.log(start)
    console.log(this.listStaff)
  }

  nextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.listStaff.length) {
      this.pageIndex++;
      this.paginate();
    }
  }
  search(): void {
    this.applyPaging();
  }
  applyPaging(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.listStaff.slice(start, end);
    this.calculatePages();
  }

  calculatePages(): void {
    this.pager.totalPages = Math.ceil(this.rowCount / this.pageSize);
    this.pager.pages = Array.from(Array(this.pager.totalPages).keys());
  }
  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.paginate();
    }
  }
// ---------------------------------active inActive --------------------------
 toggleStaff(staff: Staff): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    const updatedStatus = {
      ...staff,
      isActive: !staff.isActive, // বর্তমান isActive মানটি উল্টানো হবে
    };

    this.httpClient.put(
      `${this.authService.baseURL}/api/Staffs/${staff.staffId}`,
      updatedStatus,
      { headers }
    ).subscribe({
      next: () => {
        staff.isActive = !staff.isActive; // UI আপডেট করুন
        this.showMessage(
          'success',
          `Status changed to ${staff.isActive ? 'Active' : 'Inactive'}`
        );
      },
      error: () => {
        this.showMessage('error', 'Failed to change status');
      },
    });
  }


}

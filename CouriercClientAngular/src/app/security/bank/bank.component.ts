import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

interface Bank {
  bankId: number;
  address?: string;
  accountNo?: string;
  branchName?: string;
  createBy: string;
  createDate: Date;
  updateBy?: string;
  updateDate?: Date | null;
  isActive: boolean;
  companyId: number;
}

interface Company {
  companyId: number;
  branchName: string;
}

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.css'
})
export class BankComponent implements OnInit {

  // Display control
  isList: boolean = true;

  // Toast notification
  toast!: toastPayload;

  // Bank data
  listBank: Bank[] = [];
  listCompany: Company[] = [];  // Added this to store companies list
  bank: Bank = {
    bankId: 0,
    address: '',
    accountNo: '',
    branchName: '',
    createBy: '',
    createDate: new Date(),
    updateBy: '',
    updateDate: null,
    isActive: true,
    companyId: 0,
  };

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 10;
  rowCount: number = 0;
  listPageSize: number[] = [5, 10, 20];
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
    this.getCompanies();  // Fetch companies when the component initializes
  }

  // get(): void {
  //   const headers = new HttpHeaders({
  //     'Token': this.authService.UserInfo?.Token || '',
  //   });

  //   this.httpClient.get<any>(`${this.authService.baseURL}/api/Banks`, { headers })
  //     .subscribe({
  //       next: (response) => {
  //         this.listBank = response;
  //         this.applyPaging();
  //       },
  //       error: () => {
  //         this.showMessage('error', 'Failed to load banks');
  //       },
  //     });
  // }
  get(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });
  
    this.httpClient.get<any>(`${this.authService.baseURL}/api/Banks`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response); // Add this log to check the response data
          this.listBank = response;
          this.applyPaging();
          
        },
        error: () => {
          this.showMessage('error', 'Failed to load banks');
        },
      });
  }
  
  getCompanies(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.get<Company[]>(`${this.authService.baseURL}/api/Companies`, { headers })
      .subscribe({
        next: (response) => {
          this.listCompany = response;  // Assign companies data
        },
        error: () => {
          this.showMessage('error', 'Failed to load companies');
        },
      });
  }

  edit(item: Bank): void {
    this.bank = { ...item };
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

    const payload = { ...this.bank };

    this.httpClient.post(
      `${this.authService.baseURL}/api/Banks`,
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.reset();
        this.get();
        this.showMessage('success', 'Bank added successfully');
      },
      error: (error) => {
        this.showMessage('error', error.error || 'Failed to add bank');
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

    const payload = { ...this.bank };

    this.httpClient.put(
      `${this.authService.baseURL}/api/Banks/${this.bank.bankId}`,
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.isList = true;
        this.get();
        this.showMessage('success', 'Bank updated successfully');
      },
      error: (error) => {
        this.showMessage('error', error.error || 'Failed to update bank');
      },
    });
  }

  removeConfirm(bank: Bank): void {
    this.bank = { ...bank };
  }

  remove(bankId: number): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.delete(`${this.authService.baseURL}/api/Banks/${bankId}`, { headers })
      .subscribe({
        next: () => {
          this.reset();
          this.get();
          this.showMessage('success', 'Bank deleted successfully');
        },
        error: () => {
          this.showMessage('error', 'Failed to delete bank');
        },
      });
  }

  reset(): void {
    this.bank = {
      bankId: 0,
      address: '',
      accountNo: '',
      branchName: '',
      createBy: '',
      createDate: new Date(),
      updateBy: '',
      updateDate: null,
      isActive: true,
      companyId: 0,
    };
  }

  validateForm(): boolean {
    if (!this.bank.branchName?.trim()) {
      this.showMessage('warning', 'Branch name is required');
      return false;
    }
    if (!this.bank.accountNo?.trim()) {
      this.showMessage('warning', 'Account number is required');
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
    this.pagedItems = this.listBank.slice(start, end);
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
}


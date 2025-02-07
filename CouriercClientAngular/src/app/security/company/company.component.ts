import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

interface Company {
  companyId: number;
  companyName: string;
  createBy?: string;
  createDate?: Date;
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  // Display control
  isList: boolean = true;
  isNew: boolean = true;

  // Toast notification
  toast!: toastPayload;

  // Company data
  listCompany: Company[] = [];
  Company: Company = {
    companyId: 0,
    companyName: ""
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
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.get<Company[]>(`${this.authService.baseURL}/api/Companies`,{ headers })
    .subscribe({
      next: (response) => {
        if (response) {
          this.listCompany = response;
          this.applyPaging();
        } else {
          this.showMessage('warning', 'No companies found or session expired');
        }
      },
      error: (error) => {
        this.showMessage('error', 'Failed to fetch companies');
      }
    });
  }

  edit(item: Company): void {
    this.Company = {
      companyId: item.companyId,
      companyName: item.companyName
    };
    this.isList = false;
  }

  add(): void {
    if (!this.validateForm()) {
      return;
    }

    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo.Token,
      'Content-Type': 'application/json'
    });

    const payload = {
      companyName: this.Company.companyName,
    
    };

    this.httpClient.post(
      `${this.authService.baseURL}/api/Companies`,
      payload,
      { headers }
    ).subscribe({
      next: (response) => {
        this.isList = true;
        this.reset();
        this.get();
        this.showMessage('success', 'Company added successfully');
      },
      error: (error) => {
        this.showMessage('error', error.error || 'Failed to add company');
      }
    });
  }

  update(): void {
    if (!this.validateForm()) {
      return;
    }

    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.put(
      `${this.authService.baseURL}/api/Companies/${this.Company.companyId}`,
      this.Company,
      { headers }
    ).subscribe({
      next: () => {
        this.isList = true;
        this.get();
        this.showMessage('success', 'Company updated successfully');
      },
      error: (error) => {
        this.showMessage('error', 'Failed to update company');
      }
    });
  }

  removeConfirm(company: Company): void {
    this.Company = { ...company };
  }

  remove(company: Company): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.delete(
      `${this.authService.baseURL}/api/Companies/${company.companyId}`,
      { headers }
    ).subscribe({
      next: () => {
        this.reset();
        this.get();
        this.showMessage('success', 'Company deleted successfully');
      },
      error: (error) => {
        this.showMessage('error', 'Failed to delete company');
      }
    });
  }

  reset(): void {
    this.Company = {
      companyId: 0,
      companyName: ""
    };
  }

  validateForm(): boolean {
    if (!this.Company.companyName?.trim()) {
      this.showMessage('warning', 'Company name is required.');
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

  // Pagination methods
  applyPaging(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.listCompany.slice(start, end);
    this.totalRowsInList = this.listCompany.length;
    this.calculatePages();
  }

  calculatePages(): void {
    this.pager.totalPages = Math.ceil(this.totalRowsInList / this.pageSize);
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
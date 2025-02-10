
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

interface Branch {
  branchId: number;
  branchName: string;
  address?: string;
  parentId: number | null;
  childBranches: Branch[] | null;
  isActive: boolean;
  createBy?: string;
  createDate?: Date | null;
  updateBy?: string;
  updateDate?: Date | null;
}

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css'],
})
export class BranchComponent implements OnInit {
  // Display control
  isList: boolean = true;

  // Toast notification
  toast!: toastPayload;

  // Branch data
  listBranchs: Branch[] = [];
  branchs: Branch = {
    branchId: 0,
    branchName: '',
    createBy: "",
    address:"",
    parentId: null,
    childBranches: null,
    isActive: true,
  };

  // Dropdown branches
  dropdownBranches: { label: string; value: number; children?: { label: string; value: number }[] }[] = [];

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
    this.getBranches();
  }

  // Fetch branches from API
  getBranches(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    this.httpClient.get<{ status: boolean; message: string; content: Branch[] }>(
      `${this.authService.baseURL}/api/Branches`,
      { headers }
    ).subscribe({
      next: (response) => {
        if (response.status) {
          this.listBranchs = response.content;
          this.rowCount = response.content.length;
          this.paginate();
          this.prepareDropdownBranches(response.content);
        } else {
          this.showMessage('warning', response.message);
        }
      },
      error: () => {
        this.showMessage('error', 'Failed to load branches');
      },
    });
  }
   //Brnach dropdwon
   selectedParentBranch: any = null; // প্যারেন্ট ব্রাঞ্চের জন্য
   filteredChildBranches: any[] = []; // ফিল্টার করা চাইল্ড ব্রাঞ্চ
   onParentBranchChange() {
     // প্যারেন্ট ব্রাঞ্চ পরিবর্তন হলে, চাইল্ড ব্রাঞ্চ ফিল্টার করুন
     this.filteredChildBranches = this.listBranchs.filter(
       (branch) => branch.parentId === this.selectedParentBranch
     );
   }







  // Get branch name by ID
  getBranchName(branchId: number | null): string {
    if (branchId === null) return 'N/A';
    const branch = this.listBranchs.find((b) => b.branchId === branchId);
    return branch ? branch.branchName : 'Unknown';
  }
  // Prepare branches for dropdown display
  prepareDropdownBranches(branches: Branch[]): void {
    this.dropdownBranches = branches.map(branch => ({
      label: branch.branchName,
      value: branch.branchId,
      children: branch.childBranches?.map(child => ({
        label: child.branchName,
        value: child.branchId,
      }))
    }));
  }

  // Add a new branch
  add(): void {
    if (!this.validateForm()) return;

    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
      'Content-Type': 'application/json',
    });

    const payload = { ...this.branchs };

    this.httpClient.post(`${this.authService.baseURL}/api/Branches`, payload, { headers })
      .subscribe({
        next: () => {
          console.log(payload);
          this.isList = true;
          this.reset();
          this.getBranches();
          this.showMessage('success', 'Branch added successfully');
          
        },
        error: () => {
          this.showMessage('error', 'Failed to add branch');
        },
      });
  }

  // Update an existing branch
  update(): void {
    if (!this.validateForm()) return;

    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    const payload = { ...this.branchs };

    this.httpClient.put(`${this.authService.baseURL}/api/Branches/${this.branchs.branchId}`, payload, { headers })
      .subscribe({
        next: () => {
          this.getBranches();
          this.showMessage('success', 'Branch updated successfully');
          this.reset();
        },
        error: () => {
          this.showMessage('error', 'Failed to update branch');
        },
      });
  }

  
  remove(branchId: number): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });
  
    this.httpClient.delete(`${this.authService.baseURL}/api/Branches/${branchId}`, { headers })
      .subscribe({
        next: () => {
          this.getBranches();
          this.showMessage('success', 'Branch deleted successfully');
        },
        error: () => {
          this.showMessage('error', 'Failed to delete branch');
        },
      });
  }
  
  

  // Reset form
  reset(): void {
    this.branchs = {
      branchId: 0,
      branchName: '',
      parentId: null,
      childBranches: null,
      isActive: true,
    };
    this.isList = true;
  }

  // Populate form for editing
  edit(branch: Branch): void {
    this.branchs = { ...branch };
    this.isList = false;
  }

  // Validate form inputs
  validateForm(): boolean {
    if (!this.branchs.branchName.trim()) {
      this.showMessage('warning', 'Branch name is required');
      return false;
    }
    return true;
  }

  // Display a toast message
  showMessage(type: string, message: string): void {
    this.toast = {
      message,
      title: type.toUpperCase(),
      type,
      ic: { timeOut: 2500, closeButton: true } as IndividualConfig,
    };
    this.cs.showToast(this.toast);
  }

  // Pagination logic
  paginate(): void {
    const start = this.pageIndex * this.pageSize;
    this.pagedItems = this.listBranchs.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.listBranchs.length) {
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
    this.pagedItems = this.listBranchs.slice(start, end);
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
}

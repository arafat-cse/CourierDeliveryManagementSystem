
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { CommonService, toastPayload } from 'src/app/services/common.service';
import { AuthService } from 'src/app/auth/auth.service';

interface Receiver {
  receiverId: number;
  receiverName: string;
  receiverPhoneNumber: string;
  receiverGmail: string;
}

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css']
})
export class ReceiverComponent implements OnInit {
  isList: boolean = true;
  toast!: toastPayload;
  listReceiver: Receiver[] = [];
  receiver: Receiver = {
    receiverId: 0,
    receiverName: '',
    receiverPhoneNumber: '',
    receiverGmail: '',
  };
  pageIndex: number = 0;
  pageSize: number = 10;
  rowCount: number = 0;
  listPageSize: number[] = [5, 10, 20];
  pagedItems: Receiver[] = [];
  pager: { pages: number[]; totalPages: number } = { pages: [], totalPages: 0 };

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

    this.httpClient.get<Receiver[]>(`${this.authService.baseURL}/api/Receivers`, { headers })
      .subscribe({
        next: (response) => {
          this.listReceiver = response;
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load receivers');
        },
      });
  }

  edit(item: Receiver): void {
    this.receiver = { ...item };
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

    this.httpClient.post(`${this.authService.baseURL}/api/Receivers`, this.receiver, { headers })
      .subscribe({
        next: () => {
          this.reset();
          this.get();
          this.showMessage('success', 'Receiver added successfully');
        },
        error: () => {
          this.showMessage('error', 'Failed to add receiver');
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

    this.httpClient.put(`${this.authService.baseURL}/api/Receivers/${this.receiver.receiverId}`, this.receiver, { headers })
      .subscribe({
        next: () => {
          this.reset();
          this.get();
          this.showMessage('success', 'Receiver updated successfully');
        },
        error: () => {
          this.showMessage('error', 'Failed to update receiver');
        },
      });
  }

  removeConfirm(receiver: Receiver): void {
    this.receiver = { ...receiver };
  }

  remove(receiverId: number): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.delete(`${this.authService.baseURL}/api/Receivers/${receiverId}`, { headers })
      .subscribe({
        next: () => {
          this.reset();
          this.get();
          this.showMessage('success', 'Receiver deleted successfully');
        },
        error: () => {
          this.showMessage('error', 'Failed to delete receiver');
        },
      });
  }

  reset(): void {
    this.receiver = { receiverId: 0, receiverName: '', receiverPhoneNumber: '', receiverGmail: '' };
  }

  validateForm(): boolean {
    if (!this.receiver.receiverName.trim()) {
      this.showMessage('warning', 'Receiver name is required');
      return false;
    }
    if (!this.receiver.receiverPhoneNumber.trim()) {
      this.showMessage('warning', 'Phone number is required');
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
    this.pagedItems = this.listReceiver.slice(start, end);
    this.calculatePages();
  }

  calculatePages(): void {
    this.pager.totalPages = Math.ceil(this.rowCount / this.pageSize);
    this.pager.pages = Array.from(Array(this.pager.totalPages).keys());
  }

  search(): void {
    this.applyPaging();
  }
}


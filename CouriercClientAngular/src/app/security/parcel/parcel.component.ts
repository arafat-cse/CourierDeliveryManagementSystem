import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IndividualConfig } from 'ngx-toastr';
import { CommonService, toastPayload } from 'src/app/services/common.service';
import { ParcelType } from '../interface/ParcelType';
import { Branch } from '../interface/listBranchs';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';
import { Van } from '../interface/van';
import { ParcelService } from 'src/app/services/EmailService';
import { Staff } from '../interface/listStaff';

interface Parcel {
  parcelId: number; // Primary Key
  trackingCode: string; // Tracking Code (nvarchar)
  senderName: string | null; // Sender Name (varchar)
  senderPhone: number | null; // Sender Phone (int, nullable)
  senderAddress: string | null; // Sender Address (varchar, nullable)
  senderAlternativetoAddress: string | null; // Sender Alternative Address (varchar, nullable)
  receiverName: string | null; // Receiver Name (varchar, nullable)
  receiverPhone: number | null; // Receiver Phone (int, nullable)
  receiverEmail: string | null; // Receiver Email (varchar, nullable)
  receiverAddress: string | null; // Receiver Address (varchar, nullable)
  receiverAlternativetoAddress: string | null; // Receiver Alternative Address (varchar, nullable)
  senderCustomerId: number | null; // Sender Customer ID (int, nullable)
  sendTime: Date | null; // Parcel Send Time (datetime, nullable)
  receiverCustomerId: number | null; // Receiver Customer ID (int, nullable)
  receiveTime: Date | null; // Parcel Receive Time (datetime, nullable)
  senderBranchId: number | null; // Sender Branch ID (int, nullable)
  receiverBranchId: number | null; // Receiver Branch ID (int, nullable)
  estimatedReceiveTime: Date | null; // Estimated Receive Time (datetime, nullable)
  isPaid: boolean | false; // Payment Status (bit, nullable)
  price: number | null; // Parcel Price (decimal, nullable)
  weight: number | null; // Parcel Weight (float, nullable)
  createdBy: string | null; // Created By (nvarchar, nullable)
  createDate: Date | null; // Create Date (datetime, nullable)
  updatedBy: string | null; // Updated By (nvarchar, nullable)
  updateDate: Date | null; // Update Date (datetime, nullable)
  sendingBranch?: boolean | null; // Sending Branch Status (bit, nullable)
  percelSendingDestribution?: boolean | null; // Distribution Status during Sending (bit, nullable)
  recebingDistributin?: boolean | null; // Distribution Status during Receiving (bit, nullable)
  recebingBranch?: boolean | null; // Receiving Branch Status (bit, nullable)
  recebingReceber?: boolean | null; // Receiving Receiver Status (bit, nullable)
  isActive: boolean | null; // Active Status (bit, nullable)
  vanId: number | null; // Van ID (int, nullable)
  driverId: number | null; // Driver ID (int, nullable)
  deliveryChargeId: number | null; // Delivery Charge ID (int, nullable)
  parcelTypeId: number | null; // Parcel Type ID (int, nullable)
  status: string | null;
}

@Component({
  selector: 'app-parcel',
  templateUrl: './parcel.component.html',
  styleUrls: ['./parcel.component.css'],
})
export class ParcelComponent implements OnInit {
  isList: boolean = true;
  isNew: boolean = true;
  // Toast notification
  toast!: toastPayload;
  // Parcel Type data
  Listparcels: Parcel[] = [];
  parcelType: ParcelType[] = [];
  listBranchs: Branch[] = [];
  listVan: Van[] = [];
  listOfStaff:Staff[]=[];

  parcels: Parcel = {
    parcelId: 0,
    trackingCode: '',
    senderName: '',
    senderPhone: null, // Sender Phone (number | null)
    senderAddress: null, // Sender Address (string | null)
    senderAlternativetoAddress: null, // Sender Alternative Address (string | null)
    receiverName: null, // Receiver Name (string | null)
    receiverPhone: null, // Receiver Phone (number | null)
    receiverEmail: null, // Receiver Email (string | null)
    receiverAddress: null, // Receiver Address (string | null)
    receiverAlternativetoAddress: null, // Receiver Alternative Address (string | null)
    senderCustomerId: null, // Sender Customer ID (number | null)
    sendTime: null, // Send Time (Date | null)
    receiverCustomerId: null, // Receiver Customer ID (number | null)
    receiveTime: null, // Receive Time (Date | null)
    senderBranchId: null, // Sender Branch ID (number | null)
    receiverBranchId: null, // Receiver Branch ID (number | null)
    estimatedReceiveTime: new Date(), // Estimated Receive Time (Date | null)
    isPaid: false, // Payment Status (boolean | null)
    price: null, // Price (number | null)
    weight: null, // Weight (number | null)
    createdBy: null, // Created By (string | null)
    createDate: null, // Create Date (Date | null)
    updatedBy: null, // Updated By (string | null)
    updateDate: null, // Update Date (Date | null)
    sendingBranch: null, // Sending Branch Status (boolean | null)
    percelSendingDestribution: null, // Percel Sending Distribution (boolean | null)
    recebingDistributin: null, // Receiving Distribution (boolean | null)
    recebingBranch: null, // Receiving Branch Status (boolean | null)
    recebingReceber: null, // Receiving Receiver Status (boolean | null)
    isActive: null, // Active Status (boolean | null)
    vanId: null, // Van ID (number | null)
    driverId: null, // Driver ID (number | null)
    deliveryChargeId: null, // Delivery Charge ID (number | null)
    parcelTypeId: null, // Parcel Type ID (number | null)
    status: null, // Parcel Type ID (number | null)
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
  price: number = 100;
  receiverEmail: string = '';
  constructor(
    private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService,
    private EmailService: ParcelService
  ) {}

  ngOnInit(): void {
    this.getParcel();
    this.getStaff();
    this.getPercelType();
    this.getBranches();
    this.updatePrice();
    this.getVan();
    console.log(this.parcelType);
    
  }
  // ------------------------------------------
  // fetchReceiverEmail() {
  //   if (this.parcels.parcelId) {
  //     this.EmailService.getReceiverEmail(this.parcels.parcelId).subscribe(
  //       (email) => {
  //         this.parcels.receiverEmail = email;
  //         console.log(this.parcels.receiverEmail)
  //       },
  //       (error) => {
  //         console.error('Error fetching email:', error);
  //       }
  //     );
  //   }
  // }
  fetchReceiverEmail(parcelId: number) {
    if (parcelId) {
      this.EmailService.getReceiverEmail(parcelId).subscribe(
        (email) => {
          this.parcels.receiverEmail = email;
          console.log('Fetched Receiver Email:', this.parcels.receiverEmail);
        },
        (error) => {
          console.error('Error fetching email:', error);
        }
      );
    }
  }

  // ------------------------------------------
  getParcel(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });
    this.httpClient
      .get<any>(`${this.authService.baseURL}/api/Parcels`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          // this.reset();

          this.Listparcels = response;
          //  this.rowCount = response.totalCount || 0;
          this.paginate();
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load parcel ');
        },
      });
  }
  // parcels: Parcel = {
  //   parcelId: 0,
  //   trackingCode: '',
  //   parcelTypeId: null,
  //   weight: 1, // Default value set to 1
  //   price: null,
  //   isActive: true,
  // };

  updatePrice(): void {
    const selectedType = this.parcelType.find(
      (pt) => pt.parcelTypeId === this.parcels.parcelTypeId
    );
    console.log(this.parcelType);
    if (!selectedType) {
      this.price = 0;
      return;
    }

    // Calculate price based on selected type and weight
    if (this.parcels.weight && this.parcels.weight > 0) {
      this.price = selectedType.defaultPrice * this.parcels.weight;
      console.log(this.price);
    } else {
      this.price = selectedType.defaultPrice; // Default price if weight is not entered
      console.log(this.price);
    }
  }
  // ----------------------------------------ParcelType Start----------------------------

  getPercelType(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });
    this.httpClient
      .get<any>(`${this.authService.baseURL}/api/ParcelTypes`, { headers })
      .subscribe({
        next: (response) => {
          // if(response.isActive)
          // {

          // }

          this.parcelType = response;
          console.log(response);
          // for (let index = 0; index < response.length; index++) {
          //   const element = response[index];
          //   console.log(element.parcelTypeId);
          //   if(element.parcelTypeId == 1){
          //     this.price = 100;
          //   }else if(element.parcelTypeId == 4){
          //     this.price = 50;
          //   }else{
          //     0
          //   }
          // }

          //  console.log(response);

          //  this.rowCount = response.totalCount || 0;
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load parcel types');
        },
      });
  }
  // Get branch name by ID
  getParcelTypeName(parcelTypeId: number | null): string {
    if (parcelTypeId === null) return 'N/A';
    const branch = this.parcelType.find((b) => b.parcelTypeId === parcelTypeId);
    return branch ? branch.parcelTypeName : 'Unknown';
  }
  // ----------------------------------------ParcelType end----------------------------

  // ----------------------------------------Vans Start----------------------------
  getVan(): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    this.httpClient
      .get<any>(`${this.authService.baseURL}/api/Vans`, { headers })
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.listVan = response;
          //  this.rowCount = response.totalCount || 0;
          console.log(this.listVan);
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load Vans');
        },
      });
    console.log('Vans List:', this.listVan);
  }
  // getvanlist(vanId: number | null): string {
  //   if (vanId === null) return 'N/A';
  //   const van = this.listVan.find(d => d.VanId === vanId);
  //   return van ? van.RegistrationNo : 'Unknown';
  // }
  getvanlist(vanId: number | null): string {
    if (!vanId) return 'N/A';
    const van = this.listVan.find((d) => d.VanId === vanId);
    return van ? van.registrationNo || 'Unknown' : 'Unknown';
  }

  // ----------------------------------------Vans end----------------------------
  // ----------------------------------------Staff- Start---------------------------
  getStaff(): void {
    const headers = new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || '',
    });

    this.httpClient.get<any>(`${this.authService.baseURL}/api/Staffs`, { headers })
      .subscribe({
        next: (response) => {
          this.listOfStaff = response;
          // console.log(this.listOfStaff)
        //  this.rowCount = response.totalCount || 0;
          this.applyPaging();
        },
        error: () => {
          this.showMessage('error', 'Failed to load parcel types');
        },
      });
  }

  // ----------------------------------------Staff end----------------------------

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
    const branch = this.listBranchs.find((b) => b.branchId === branchId);
    return branch ? branch.branchName : 'Unknown';
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
  // onParentBranchChange(): void {
  //   if (this.selectedParentBranch) {
  //     this.filteredChildBranches =
  //       this.selectedParentBranch.childBranches || [];
  //   } else {
  //     this.filteredChildBranches = [];
  //   }
  // }

  recevarSelectedParentBranch: any = null;
  recevarFilteredChildBranches: any[] = [];
  recevarParentBranchChange(): void {
    this.recevarFilteredChildBranches = this.listBranchs.filter(
      (branch) => branch.parentId === this.recevarSelectedParentBranch
    );
  }

  edit(item: Parcel): void {
    console.log(item);
    this.parcels = {
      parcelId: item.parcelId,
      trackingCode: item.trackingCode,
      senderName: item.senderName,
      senderPhone: item.senderPhone,
      senderAddress: item.senderAddress,
      senderAlternativetoAddress: item.senderAlternativetoAddress,
      receiverName: item.receiverName,
      receiverPhone: item.receiverPhone,
      receiverEmail: item.receiverEmail,
      receiverAddress: item.receiverAddress,
      receiverAlternativetoAddress: item.receiverAlternativetoAddress,
      senderCustomerId: item.senderCustomerId,
      sendTime: item.sendTime,
      receiverCustomerId: item.receiverCustomerId,
      receiveTime: item.receiveTime,
      senderBranchId: item.senderBranchId,
      receiverBranchId: item.receiverBranchId,
      estimatedReceiveTime: item.estimatedReceiveTime,
      isPaid: item.isPaid,
      price: item.price,
      weight: item.weight,
      createdBy: item.createdBy,
      createDate: item.createDate,
      updatedBy: item.updatedBy,
      updateDate: item.updateDate,
      sendingBranch: item.sendingBranch,
      percelSendingDestribution: item.percelSendingDestribution,
      recebingDistributin: item.recebingDistributin,
      recebingBranch: item.recebingBranch,
      recebingReceber: item.recebingReceber,
      isActive: item.isActive,
      vanId: item.vanId,
      driverId: item.driverId,
      deliveryChargeId: item.deliveryChargeId,
      parcelTypeId: item.parcelTypeId,
      status: item.status,
    };
    this.isList = false;
  }
  //স্প্রেড অপারেটর সমাধান
  // edit(item: Parcel): void {
  //   this.parcels = { ...item };
  //   this.isList = false;
  // }

  // add(): void {
  //   if (!this.validateForm()) {
  //     return;
  //   }

  //   const headers = new HttpHeaders({
  //     'Token': this.authService.UserInfo?.Token,
  //     'Content-Type': 'application/json',
  //   });

  //   const payload = {
  //     ...this.parcels, // Include all necessary properties for a new parcel type
  //   };

  //   this.httpClient.post(
  //     `${this.authService.baseURL}/api/Parcels`,
  //     payload,
  //     { headers }
  //   ).subscribe({
  //     next: () => {
  //       this.reset();
  //       this.get();
  //       this.showMessage('success', 'Parcel type added successfully');
  //     },
  //     error: (error) => {
  //       this.showMessage('error', error.error || 'Failed to add parcel type');
  //     },
  //   });
  // }
  generate8DigitCode(): number {
    return Math.floor(10000000 + Math.random() * 90000000);
  }
  add(): void {
    if (!this.validateForm()) {
      return;
    }
    this.parcels.trackingCode = this.generate8DigitCode().toString();
    const token = this.authService.UserInfo?.Token || '';
    if (!token) {
      this.showMessage('error', 'Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Token: token,
      'Content-Type': 'application/json',
    });
    this.parcels.price = this.price;
    const payload = {
      ...this.parcels, // Include all necessary properties for a new parcel type
    };
    console.log();
    this.httpClient
      .post(`${this.authService.baseURL}/api/Parcels`, payload, { headers })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.isList = true;
          // this.reset();
          this.getParcel();
          this.showMessage('success', 'Parcel added successfully');
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Failed to add parcel';
          this.showMessage('error', errorMessage);
        },
      });
  }

  // validateForm(): boolean {
  //   if (!this.parcels.trackingCode.trim()) {
  //     this.showMessage('warning', 'Parcel type name is required');
  //     return false;
  //   }
  //   return true;
  // }

  // -------------------------------------From Validation-----------------------

  // validateForm(): boolean {
  //   if (!this.parcels.trackingCode || !this.parcels.trackingCode.trim()) {
  //     this.showMessage('warning', 'Parcel tracking code is required');
  //     return false;
  //   }
  //   return true;
  // }
  validateForm(): boolean {
    // Tracking Code Validation
    // if (!this.parcels.trackingCode) {
    //   this.showMessage('warning', 'Parcel tracking code is required');
    //   return false;
    // }
    // Sender Validation
    // if (!this.parcels.senderName || !this.parcels.senderName.trim()) {
    //   this.showMessage('warning', 'Sender Name is required');
    //   return false;
    // }
    // if (!this.parcels.senderPhone || !this.parcels.senderPhone.toString().trim()) {
    //   this.showMessage('warning', 'Sender Phone is required');
    //   return false;
    // }

    // if (!this.parcels.senderAddress || !this.parcels.senderAddress.trim()) {
    //   this.showMessage('warning', 'Sender Address is required');
    //   return false;
    // }
    // if (!this.parcels.senderAlternativetoAddress || !this.parcels.senderAlternativetoAddress.trim()) {
    //   this.showMessage('warning', 'Sender Alternative Address is required');
    //   return false;
    // }

    // Receiver Validation
    // if (!this.parcels.receiverName || !this.parcels.receiverName.trim()) {
    //   this.showMessage('warning', 'Receiver Name is required');
    //   return false;
    // }
    // if (!this.parcels.receiverPhone || !this.parcels.receiverPhone.toString().trim()) {
    //   this.showMessage('warning', 'Receiver Phone is required');
    //   return false;
    // }
    // if (!this.parcels.receiverEmail || !this.parcels.receiverEmail.trim()) {
    //   this.showMessage('warning', 'Receiver Email is required');
    //   return false;
    // }
    // if (!this.parcels.receiverAddress || !this.parcels.receiverAddress.trim()) {
    //   this.showMessage('warning', 'Receiver Address is required');
    //   return false;
    // }
    // if (!this.parcels.receiverAlternativetoAddress || !this.parcels.receiverAlternativetoAddress.trim()) {
    //   this.showMessage('warning', 'Receiver Alternative Address is required');
    //   return false;
    // }

    return true;
  }
  // -------------------------------------From Validation-----------------------
  //update all
  update(): void {
    if (!this.validateForm()) {
      return;
    }
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token,
    });

    // const payload = {
    //   parcelId: this.parcels.parcelId,
    //   trackingCode: this.parcels.trackingCode,
    //   senderName:this.parcels.senderName,
    //   isActive: this.parcels.isActive,
    // };
    this.updatePrice();
    const payload = {
      parcelId: this.parcels.parcelId, // Parcel ID
      trackingCode: this.parcels.trackingCode, // Tracking Code
      senderName: this.parcels.senderName, // Sender Name
      senderPhone: this.parcels.senderPhone, // Sender Phone
      senderAddress: this.parcels.senderAddress, // Sender Address
      senderAlternativetoAddress: this.parcels.senderAlternativetoAddress, // Sender Alternative Address
      receiverName: this.parcels.receiverName, // Receiver Name
      receiverPhone: this.parcels.receiverPhone, // Receiver Phone
      receiverEmail: this.parcels.receiverEmail, // Receiver Email
      receiverAddress: this.parcels.receiverAddress, // Receiver Address
      receiverAlternativetoAddress: this.parcels.receiverAlternativetoAddress, // Receiver Alternative Address
      senderCustomerId: this.parcels.senderCustomerId, // Sender Customer ID
      sendTime: this.parcels.sendTime, // Parcel Send Time
      receiverCustomerId: this.parcels.receiverCustomerId, // Receiver Customer ID
      receiveTime: this.parcels.receiveTime, // Parcel Receive Time
      senderBranchId: this.parcels.senderBranchId, // Sender Branch ID
      receiverBranchId: this.parcels.receiverBranchId, // Receiver Branch ID
      estimatedReceiveTime: this.parcels.estimatedReceiveTime, // Estimated Receive Time
      isPaid: this.parcels.isPaid, // Payment Status
      price: this.price, // Parcel Price
      weight: this.parcels.weight, // Parcel Weight
      createdBy: this.parcels.createdBy, // Created By
      createDate: this.parcels.createDate, // Create Date
      updatedBy: this.parcels.updatedBy, // Updated By
      updateDate: this.parcels.updateDate, // Update Date
      sendingBranch: this.parcels.sendingBranch, // Sending Branch Status
      percelSendingDestribution: this.parcels.percelSendingDestribution, // Distribution Status during Sending
      recebingDistributin: this.parcels.recebingDistributin, // Distribution Status during Receiving
      recebingBranch: this.parcels.recebingBranch, // Receiving Branch Status
      recebingReceber: this.parcels.recebingReceber, // Receiving Receiver Status
      isActive: this.parcels.isActive, // Active Status
      vanId: this.parcels.vanId, // Van ID
      driverId: this.parcels.driverId, // Driver ID
      deliveryChargeId: this.parcels.deliveryChargeId, // Delivery Charge ID
      parcelTypeId: this.parcels.parcelTypeId, // Parcel Type ID
      status: this.parcels.status,
    };

    console.log(payload);

    this.httpClient
      .put(
        `${this.authService.baseURL}/api/Parcels/${this.parcels.parcelId}`,
        payload,
        { headers }
      )
      .subscribe({
        next: () => {
          this.isList = true;
          this.getParcel();
          this.showMessage('success', 'Parcel updated successfully');
        },
        error: (error) => {
          this.showMessage('error', error.error || 'Failed to update parcel ');
        },
      });
  }

  removeConfirm(parcel: Parcel): void {
    this.parcels = { ...parcel };
  }

  remove(parcel: Parcel): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    this.httpClient
      .delete(`${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`, {
        headers,
      })
      .subscribe({
        next: () => {
          this.reset();
          this.getParcel();
          this.showMessage('success', 'Parcel deleted successfully');
        },
        error: () => {
          this.showMessage('error', 'Failed to delete parcel ');
        },
      });
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

  reset(): void {
    this.parcels = {
      parcelId: 0,
      trackingCode: '',
      createdBy: '', // Corrected property name
      createDate: null,
      updatedBy: '', // Corrected property name
      updateDate: null,
      isActive: true,
      senderName: '', // Add other mandatory properties as per the Parcel interface
      senderPhone: null,
      senderAddress: null,
      senderAlternativetoAddress: null,
      receiverName: null,
      receiverPhone: null,
      receiverEmail: null,
      receiverAddress: null,
      receiverAlternativetoAddress: null,
      senderCustomerId: null,
      sendTime: null,
      receiverCustomerId: null,
      receiveTime: null,
      senderBranchId: null,
      receiverBranchId: null,
      estimatedReceiveTime: null,
      isPaid: false,
      price: null,
      weight: null,
      sendingBranch: null,
      percelSendingDestribution: null,
      recebingDistributin: null,
      recebingBranch: null,
      recebingReceber: null,
      vanId: null,
      driverId: null,
      deliveryChargeId: null,
      parcelTypeId: null,
      status: null,
    };
  }

  
  // -----------------------------------------Boolean--------------------------Status--------

  // ---------------------------------active inActive --------------------------
  //  toggleParcel(parcel: Parcel): void {
  //     const headers = new HttpHeaders({
  //       'Token': this.authService.UserInfo?.Token || '',
  //     });

  //     const updatedStatus = {
  //       ...parcel,
  //       SendingBranch: !parcel.sendingBranch, // বর্তমান isActive মানটি উল্টানো হবে
  //     };

  //     this.httpClient.put(
  //       `${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`,
  //       updatedStatus,
  //       { headers }
  //     ).subscribe({
  //       next: () => {
  //         parcel.sendingBranch = !parcel.sendingBranch; // UI আপডেট করুন
  //         this.showMessage(
  //           'success',
  //           `Status changed to ${parcel.sendingBranch ? 'YES' : 'NO'}`
  //         );
  //       },
  //       error: () => {
  //         this.showMessage('error', 'Failed to change status');
  //       },
  //     });
  //   }

  //Model Data Uthano
  selectedParcel: any = null;

  selectParcel(parcel: any): void {
    console.log(parcel);
    this.selectedParcel = parcel;
  }
  //  // Method to generate PDF for a single row
  //  generatePDF(parcel: any) {
  //   const doc = new jsPDF();

  //   // Define the content of the PDF
  //   const content = `
  //     Parcel Invoice
  //     -------------------------------
  //     Tracking Code: ${parcel.trackingCode}
  //     Sender Name: ${parcel.senderName}
  //     Sender Phone: ${parcel.senderPhone}
  //     Receiver Name: ${parcel.receiverName}
  //     Receiver Phone: ${parcel.receiverPhone}
  //     Sender Branch: ${this.getBranchName(parcel.senderBranchId)}
  //     Receiver Branch: ${this.getBranchName(parcel.receiverBranchId)}
  //     Is Paid: ${parcel.isPaid ? 'YES' : 'NO'}
  //     Parcel Type: ${this.getParcelTypeName(parcel.parcelTypeId)}
  //     Status: ${parcel.isActive ? 'Active' : 'Inactive'}
  //   `;

  //   // Add content to PDF
  //   doc.text(content, 10, 10);

  //   // Save the PDF
  //   doc.save(`Parcel_${parcel.trackingCode}.pdf`);
  // }
  generatePDF(parcel: any,action: string) {
    const doc = new jsPDF();

    console.log('Selected Parcel:', parcel);

    // Set company details at the top
    const companyLogo = 'data:image/png;base64,...'; // Replace with your Base64 logo
    //doc.addImage(companyLogo, 'PNG', 10, 10, 30, 15); // x, y, width, height
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Parcel Invoice', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('SmartCourier', 105, 26, { align: 'center' });
    doc.text('Address: Shawrapara, Mirpur-12, Dhaka, Bangladesh', 105, 32, {
      align: 'center',
    });
    doc.text('Phone: 01949201049 | Email: info@smartcourier.com', 105, 38, {
      align: 'center',
    });

    // Draw a separator line
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 45, 200, 45); // x1, y1, x2, y2

    doc.text(`Tracking Code: ${parcel.trackingCode}`, 80, 50);
    // // Add sender information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Sender Information', 10, 55); // Left side
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${parcel?.senderName}`, 10, 62);
    doc.text(`Phone: ${parcel?.senderPhone}`, 10, 68);
    doc.text(`Branch: ${this.getBranchName(parcel?.senderBranchId)}`, 10, 74);
    doc.text(`Estimated: ${parcel?.estimatedReceiveTime}`, 10, 80);

    // Add receiver information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Receiver Information', 125, 55); // Right side
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${parcel.receiverName}`, 125, 62);
    doc.text(`Phone: ${parcel.receiverPhone}`, 125, 68);
    doc.text(`E-mail: ${parcel.receiverEmail}`, 125, 74);
    doc.text(`Branch: ${this.getBranchName(parcel.receiverBranchId)}`, 125, 80);

    // Draw a separator line
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 90, 200, 90); // x1, y1, x2, y2
 // Add selectParcel details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Parcel Details', 10, 87);
    // doc.text(`Tracking Code: ${parcel.trackingCode}`, 10, 95);
    doc.text(`Type: ${this.getParcelTypeName(parcel.parcelTypeId)}`, 10, 95);
    doc.text(`Delivery Charge: ${parcel.price}`, 80, 95);
    doc.text(`Paid: ${parcel.isPaid ? 'YES' : 'NO'}`, 150, 95);
       // Draw a separator line
       doc.setDrawColor(0, 0, 0);
       doc.line(10, 100, 200, 100); // x1, y1, x2, y2
        // Add Description
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Description:', 10, 110);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Description: ${parcel.status}`, 10, 115);

    // Footer with date
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text('Bookig Officer signature:', 10, 125); // Bottom-left corner
    doc.text('Thank you for choosing our service!', 100, 125, {
      align: 'center',
    });
    doc.text(`Date: ${currentDate}`, 150, 125); // Bottom-left corner

// ------------------------------------------------------------ 
console.log('Selected Parcel:', parcel);

// Set company details at the top
const companyLog = 'data:image/png;base64,...'; // Replace with your Base64 logo
//doc.addImage(companyLogo, 'PNG', 10, 10, 30, 15); // x, y, width, height
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.text('Parcel Invoice', 105, 172, { align: 'center' });
doc.setFontSize(12);
doc.text('Smart Courier', 105, 178, { align: 'center' });
doc.text('Address: Shawrapara, Mirpur-12, Dhaka, Bangladesh', 105, 184, {
  align: 'center',
});
doc.text('Phone: 01949201049 | Email: info@smartcourier.com', 105, 190, {
  align: 'center',
});

// Draw a separator line
doc.setDrawColor(0, 0, 0);
doc.line(10, 194, 200, 194); // x1, y1, x2, y2

doc.text(`Tracking Code: ${parcel.trackingCode}`, 80, 200);
// // Add sender information
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.text('Sender Information', 10, 206); // Left side
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);
doc.text(`Name: ${parcel?.senderName}`, 10, 214);
doc.text(`Phone: ${parcel?.senderPhone}`, 10, 220);
doc.text(`Branch: ${this.getBranchName(parcel?.senderBranchId)}`, 10, 226);
doc.text(`Estimated: ${parcel?.estimatedReceiveTime}`, 10, 232);

// Add receiver information
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.text('Receiver Information', 125, 206); // Right side
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);
doc.text(`Name: ${parcel.receiverName}`, 125, 214);
doc.text(`Phone: ${parcel.receiverPhone}`, 125, 220);
doc.text(`E-mail: ${parcel.receiverEmail}`, 125, 226);
doc.text(`Branch: ${this.getBranchName(parcel.receiverBranchId)}`, 125, 232);

// Draw a separator line
doc.setDrawColor(0, 0, 0);
doc.line(10, 246, 200, 246); // x1, y1, x2, y2

// Add selectParcel details
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.text('Parcel Details', 10, 240);

doc.text(`Type: ${this.getParcelTypeName(parcel.parcelTypeId)}`, 10, 252);
doc.text(`Delivery Charge: ${parcel.price}`, 80, 252);
doc.text(`Paid: ${parcel.isPaid ? 'YES' : 'NO'}`, 150, 252);
   // Draw a separator line
   doc.setDrawColor(0, 0, 0);
   doc.line(10, 258, 200, 258); // x1, y1, x2, y2
    // Add Description
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Description:', 10, 264);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Description: ${parcel.status}`, 10, 270);

// Footer with date
const lcurrentDate = new Date().toLocaleDateString();
doc.setFontSize(10);
doc.text('Bookig Officer signature:', 10, 280); // Bottom-left corner
doc.text('Thank you for choosing our service!', 100, 280, {
  align: 'center',
});
doc.text(`Date: ${lcurrentDate}`, 150, 280); // Bottom-left corner

// ------------------------------------------------------------ 

    
    if (action === 'download') {
      // Save the PDF if the action is download
      doc.save(`Parcel_${parcel.trackingCode}.pdf`);
    } else if (action === 'print') {
      // Print the PDF if the action is print
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }
    // Save the PDF
    // doc.save(`Parcel_${parcel.trackingCode}.pdf`);
    // Print the PDF
  // doc.autoPrint();
  // window.open(doc.output('bloburl'), '_blank');
  }
  // updateParcelStatus(id: number, status: string): Observable<any> {
  //   const url =  `${this.authService.baseURL}/api//Parcels/UpdateStatus/${id}`;
  //   return this.httpClient.put(url, status, { headers: { 'Content-Type': 'application/json' } });
  // }

  updateParcelStatus(id: number, status: string): Observable<any> {
    const url = `${this.authService.baseURL}/api/Parcels/UpdateStatus/${id}`;
    return this.httpClient.put(url, status, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updateStatus(parcelId: number, newStatus: string | undefined): void {
    if (!newStatus) {
      alert('Please select a valid status.');
      return;
    }
    this.updateParcelStatus(parcelId, newStatus).subscribe({
      next: (response) => {
        console.log(response);
        alert('Status updated successfully!');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update status.');
      },
    });
  }

  // ---------------------------------active inActive --------------------------

  toggleSendingBranch(parcel: Parcel): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    const updatedStatus = {
      ...parcel,
      sendingBranch: !parcel.sendingBranch, // বর্তমান isActive মানটি উল্টানো হবে
    };

    this.httpClient
      .put(
        `${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`,
        updatedStatus,
        { headers }
      )
      .subscribe({
        next: () => {
          parcel.sendingBranch = !parcel.sendingBranch; // UI আপডেট করুন
          window.location.reload();
          this.showMessage(
            'success',
            `Status changed to ${parcel.sendingBranch ? 'YES' : 'NO'}`
          );
        },
        error: () => {
          this.showMessage('error', 'Failed to change status');
        },
      });
  }
  // ---------------------------------active inActive --------------------------

  togglePercelSendingDestribution(parcel: Parcel): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    const updatedStatus = {
      ...parcel,
      percelSendingDestribution: !parcel.percelSendingDestribution, // বর্তমান isActive মানটি উল্টানো হবে
    };

    this.httpClient
      .put(
        `${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`,
        updatedStatus,
        { headers }
      )
      .subscribe({
        next: () => {
          parcel.percelSendingDestribution = !parcel.percelSendingDestribution; // UI আপডেট করুন
          window.location.reload();
          this.showMessage(
            'success',
            `Status changed to ${
              parcel.percelSendingDestribution ? 'YES' : 'NO'
            }`
          );
        },
        error: () => {
          this.showMessage('error', 'Failed to change status');
        },
      });
  }
  // ---------------------------------active inActive --------------------------

  toggleRecebingDistributin(parcel: Parcel): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    const updatedStatus = {
      ...parcel,
      recebingDistributin: !parcel.recebingDistributin, // বর্তমান isActive মানটি উল্টানো হবে
    };

    this.httpClient
      .put(
        `${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`,
        updatedStatus,
        { headers }
      )
      .subscribe({
        next: () => {
          parcel.recebingDistributin = !parcel.recebingDistributin; // UI আপডেট করুন
          window.location.reload();
          this.showMessage(
            'success',
            `Status changed to ${parcel.recebingDistributin ? 'YES' : 'NO'}`
          );
        },
        error: () => {
          this.showMessage('error', 'Failed to change status');
        },
      });
  }
  // ---------------------------------active inActive --------------------------

  //  toggleRecebingBranch(parcel: Parcel): void {
  //   const headers = new HttpHeaders({
  //     'Token': this.authService.UserInfo?.Token || '',
  //   });

  //   const updatedStatus = {
  //     ...parcel,
  //     recebingBranch: !parcel.recebingBranch, // বর্তমান isActive মানটি উল্টানো হবে
  //   };

  //   this.httpClient.put(
  //     `${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`,
  //     updatedStatus,
  //     { headers }
  //   ).subscribe({
  //     next: () => {
  //       parcel.recebingBranch = !parcel.recebingBranch; // UI আপডেট করুন
  //       window.location.reload();
  //       this.showMessage(
  //         'success',
  //         `Status changed to ${parcel.recebingBranch ? 'YES' : 'NO'}`
  //       );
  //     },
  //     error: () => {
  //       this.showMessage('error', 'Failed to change status');
  //     },
  //   });
  // }

  // sendParcelData():void {
  //   const parcelData = {
  //     parcelId: 101,
  //     receiverEmail: 'test@example.com',
  //     address: 'Dhaka, Bangladesh',
  //   };

  toggleRecebingBranch(parcel: Parcel): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });
console.log(parcel)
    const updatedStatus = {
      ...parcel,
      recebingBranch: !parcel.recebingBranch, // বর্তমান মান উল্টানো হবে
    };

    // console.log(updatedStatus.recebingBranch)
    if (updatedStatus.recebingBranch) {
      // this.getStaff();
     console.log(this.listOfStaff)
     console.log(parcel.receiverBranchId)
     const receverBranch= this.listBranchs.find(rB=>rB.branchId==parcel.receiverBranchId);
     console.log(this.listOfStaff.find(sId=>sId.branchId==parcel.receiverBranchId))
     const staffBranch = this.listOfStaff.find(sId=>sId.branchId==parcel.receiverBranchId)
      // const parcelData = {
      //   // toEmail: 'samaul.isdb@gmail.com',
      //   toEmail:parcel.receiverEmail,
      //   subject: `Collaced your Parcel from ${receverBranch?.branchName} Branch`,
      //   body: '',
      // };
      // const parcelData = {
      //   toEmail: parcel.receiverEmail,
      //   subject: `Collect Your Parcel from ${receverBranch?.branchName} Branch`,
      //   body: `
      //     Dear ${parcel.receiverName},\n
      
      //     We are pleased to inform you that your parcel has arrived at the ${receverBranch?.branchName} branch. You can collect it at your earliest convenience.
      
      //     **Tracking Code:** ${parcel.trackingCode}
      
      //     Please bring a valid ID and your tracking code while collecting the parcel.
      
      //     **Branch Address:** ${receverBranch?.address}  
      //     **Branch Contact:** ${staffBranch?.staffPhone}  
      
      //     If you have any questions, feel free to contact us.
      
      //     Best Regards,  
      //     Comapany Name: Smart Courier
      //     Customer Support: arafat.dev61@gmail.com | 01971201048
      //   `,
      // };
      const parcelData = {
        toEmail: parcel.receiverEmail,
        subject: `Collect Your Parcel from ${receverBranch?.branchName} Branch`,
        body: `
        <p>Dear ${parcel.receiverName},</p>
        
        <p>We are pleased to inform you that your parcel has arrived at the <strong>${receverBranch?.branchName}</strong> branch.</p>
        <p>You can collect it at your earliest convenience.</p>
        
        <p><strong>Tracking Code:</strong> ${parcel.trackingCode}</p>
        <p><strong>Click Link :</strong> <a href="http://localhost:4200/tracking">http://localhost:4200/tracking</a>  </p>
            
        
        
        <p>Please bring a valid ID and your tracking code while collecting the parcel.</p>
        
        <p><strong>Branch Address:</strong> ${receverBranch?.address}</p>
        <p><strong>Branch Contact:</strong> ${staffBranch?.staffPhone}</p>
        
        <p>If you have any questions, feel free to contact us.</p>
        
        <p>Best Regards,</p>
        
        <p><strong>Company Name:</strong> Smart Courier</p>
        <p><strong>Customer Support:</strong> <a href="mailto:arafat.dev61@gmail.com">arafat.dev61@gmail.com</a> | 01971201048</p>
        `,
    };
    
      
console.log(parcelData);

console.log(this.listBranchs.find(recevarBranch=>recevarBranch.branchId==parcel.receiverBranchId));

      this.EmailService.sendParcel(parcelData).subscribe(
        (response) => {
          console.log('Success:', response);
          this.showMessage(
            'success',
            `email send successfully`
          );
          window.location.reload();
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
    this.httpClient
      .put(
        `${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`,
        updatedStatus,
        { headers }
      )
      .subscribe({
        next: () => {
          parcel.recebingBranch = !parcel.recebingBranch; // UI আপডেট করুন

          if (parcel.recebingBranch) {
            // যদি recebingBranch = YES হয়, তাহলে Receiver Email নিয়ে আসবে
            this.fetchReceiverEmail(parcel.parcelId);
          } else {
            // যদি recebingBranch = NO হয়, তাহলে Receiver Email ফাঁকা করে দিন
            this.parcels.receiverEmail = '';
          }

          this.showMessage(
            'success',
            `Status changed to ${parcel.recebingBranch ? 'YES' : 'NO'}`
          );
        },
        error: () => {
          this.showMessage('error', 'Failed to change status');
        },
      });
  }

  // ---------------------------------active inActive --------------------------

  toggleRecebingReceber(parcel: Parcel): void {
    const headers = new HttpHeaders({
      Token: this.authService.UserInfo?.Token || '',
    });

    const updatedStatus = {
      ...parcel,
      recebingReceber: !parcel.recebingReceber, // বর্তমান isActive মানটি উল্টানো হবে
    };

    this.httpClient
      .put(
        `${this.authService.baseURL}/api/Parcels/${parcel.parcelId}`,
        updatedStatus,
        { headers }
      )
      .subscribe({
        next: () => {
          parcel.recebingReceber = !parcel.recebingReceber; // UI আপডেট করুন
          window.location.reload();
          this.showMessage(
            'success',
            `Status changed to ${parcel.recebingReceber ? 'YES' : 'NO'}`
          );
        },
        error: () => {
          this.showMessage('error', 'Failed to change status');
        },
      });
  }
  // Pagination logic
  paginate(): void {
    const start = this.pageIndex * this.pageSize;
    this.pagedItems = this.Listparcels.slice(start, start + this.pageSize);
    console.log(this.pagedItems)
    console.log(start)
    console.log(this.Listparcels)
  }

  nextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.Listparcels.length) {
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
    this.pagedItems = this.Listparcels.slice(start, end);
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

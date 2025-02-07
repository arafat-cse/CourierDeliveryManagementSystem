import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
//import { NgChartsModule } from 'ng2-charts';

import { CompanyComponent } from './security/company/company.component';
import { BranchComponent } from './security/branch/branch.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParcelTypeComponent } from './security/parcel-type/parcel-type.component';

import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
//Metarial Css
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DeliveryChargeComponent } from './security/delivery-charge/delivery-charge.component';
import { DesignationComponent } from './security/designation/designation.component';
import { BankComponent } from './security/bank/bank.component';
import { CustomerComponent } from './security/customer/customer.component';
import { PaymentMethodComponent } from './security/payment-method/payment-method.component';
import { ReceiverComponent } from './security/receiver/receiver.component';
import { StaffComponent } from './security/staff/staff.component';
import { VanComponent } from './security/van/van.component';
import { ParcelComponent } from './security/parcel/parcel.component';
import { InvoiceComponent } from './security/invoice/invoice.component';
import { HomeComponent } from "./home/home.component";
import { TrackingComponent } from './security/tracking/tracking.component';
@NgModule({
  declarations: [
    AppComponent,
    CompanyComponent,
    BranchComponent,
    LoginComponent,
    DashboardComponent,
    ParcelTypeComponent,
    DeliveryChargeComponent,
    DesignationComponent,
    BankComponent,
    CustomerComponent,
    PaymentMethodComponent,
    ReceiverComponent,
    StaffComponent,
    VanComponent,
    ParcelComponent,
    InvoiceComponent,
   
    
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), //,
    CommonModule,
    //NgChartsModule
    MatSlideToggleModule,
    HomeComponent,
    TrackingComponent
    
],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

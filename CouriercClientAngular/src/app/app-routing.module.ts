import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { CompanyComponent } from './security/company/company.component';
import { BranchComponent } from './security/branch/branch.component';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParcelTypeComponent } from './security/parcel-type/parcel-type.component';
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
import { HomeComponent } from './home/home.component';
import { TrackingComponent } from './security/tracking/tracking.component';
/*import { TestComponent } from '@angular/core/testing';*/

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch:'full' },
  //comment chilo
  //{ path: '**', redirectTo: '/login' },

  { path: 'company', component: CompanyComponent, canActivate:[authGuard] },
  { path: 'branch', component: BranchComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate:[authGuard] },
  { path: 'parcel-type', component: ParcelTypeComponent, canActivate: [authGuard] },
  { path: 'delivery-charge', component: DeliveryChargeComponent, canActivate: [authGuard] },
  { path: 'designation', component: DesignationComponent, canActivate: [authGuard] },
  { path: 'bank', component: BankComponent, canActivate: [authGuard] },
  { path: 'Payment', component: PaymentMethodComponent, canActivate: [authGuard] },
  { path: 'customer', component: CustomerComponent, canActivate: [authGuard] },
  { path: 'receiver', component: ReceiverComponent, canActivate: [authGuard] },
  { path: 'staff', component: StaffComponent, canActivate: [authGuard] },
  { path: 'van', component: VanComponent, canActivate: [authGuard] },
  { path: 'parcel', component: ParcelComponent, canActivate: [authGuard] },
  { path: 'invoice', component: InvoiceComponent, canActivate: [authGuard] },
  { path: 'tracking', component: TrackingComponent },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

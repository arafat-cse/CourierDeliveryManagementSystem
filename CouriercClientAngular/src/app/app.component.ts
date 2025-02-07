import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
//import { CommonService, toastPayload } from './services/common.service';
//import { IndividualConfig } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CDMS';
  //toast!: toastPayload;
  //isLogIn:boolean = false;
  //userName:string = '';
  /*userInfo:{
    UserName:string,
    isLoggedIn:boolean
  } ={
    UserName:'',
    isLoggedIn:false
  };*/
  
  constructor(public authService: AuthService, 
    private router: Router
    //,private cs:CommonService
    ) {
    //this.userInfo = this.authService.userInfo;
  }

  logout(): void {
    this.authService.logout();
    //this.isLogIn = this.authService.isLoggedIn;
    //this.userInfo = this.authService.userInfo;
    this.router.navigate([this.authService.UserInfo.RedirectURL]);
  }

  login():void{
    this.authService.logout();
    this.router.navigate([this.authService.UserInfo.RedirectURL]);
  }

  listModule:any=[
    {
    ModuleId:1,
    ModuleName:''
  }
  ];

  listMenu:any=[
    {
      MenuId:1,
      MenuName:'Home',
      ModuleId:1
    }
  ];
}

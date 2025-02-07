import { Injectable, numberAttribute } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //isLogIn:boolean = false;
  UserInfo:{
    UserName:string,
    IsLogIn:boolean
    UserID:number,
    Token:string,
    //Permissions:any,
    RedirectURL:string,
    ModuleMenus:any//,
    //nNotify:number,
    // Menu:{
    //   CanCreate: boolean,
    //   CanDelete: boolean,
    //   CanEdit:  boolean,
    //   CanView: boolean,
    //   IsActive: boolean,
    //   IsSubParent: boolean,
    //   MenuCode: string,
    //   MenuIcon: string,
    //   MenuId: number,
    //   MenuName: string,
    //   MenuPath: string,
    //   MenuSequence: number,
    //   ModuleIcon: string,
    //   ModuleId: number,
    //   ModuleName: string,
    //   ParentId: number,
    //   RoleId : number,
    //   RoleName : string,
    //   SubPareMenuNamentId: number
    // }
  } = {
    UserName:'',
    IsLogIn:false,
    UserID:0,
    Token:'',
    //Permissions:[],
    RedirectURL:'',
    ModuleMenus:[]//,
    //nNotify:0,
    // Menu:{
    //   CanCreate: false,
    //   CanDelete: false,
    //   CanEdit:  false,
    //   CanView: false,
    //   IsActive: false,
    //   IsSubParent: false,
    //   MenuCode: "",
    //   MenuIcon: "",
    //   MenuId: 0,
    //   MenuName: "",
    //   MenuPath: "",
    //   MenuSequence: 4,
    //   ModuleIcon: "",
    //   ModuleId: 2,
    //   ModuleName: "",
    //   ParentId: 0,
    //   RoleId : 0,
    //   RoleName : "",
    //   SubPareMenuNamentId: 0
    // }
  };

  resetMenu(){
    // this.UserInfo.Menu = {
    //   CanCreate: false,
    //   CanDelete: false,
    //   CanEdit:  false,
    //   CanView: false,
    //   IsActive: false,
    //   IsSubParent: false,
    //   MenuCode: "",
    //   MenuIcon: "",
    //   MenuId: 0,
    //   MenuName: "",
    //   MenuPath: "",
    //   MenuSequence: 0,
    //   ModuleIcon: "",
    //   ModuleId: 0,
    //   ModuleName: "",
    //   ParentId: 0,
    //   RoleId : 0,
    //   RoleName : "",
    //   SubPareMenuNamentId: 0
    // }
    // return this.UserInfo.Menu;
  }

  constructor() { 
    const strUserInfo = localStorage.getItem("UserInfo");
    if (typeof strUserInfo === 'string') {
        this.UserInfo = JSON.parse(strUserInfo);
    }
  }

  // store the URL so we can redirect after logging in
  baseURL:string='http://localhost:5041';
  //baseURL:string='';
  //redirectUrl: string | null = null;
  login(userInfo:any, isLogIn:boolean):Observable<boolean> {
    this.reset();
    if(isLogIn){
      this.UserInfo.IsLogIn = isLogIn;
      this.UserInfo.UserName = userInfo.userName;
      this.UserInfo.Token = userInfo.passWord;
      this.UserInfo.UserID = userInfo.userId;
      //this.UserInfo.Permissions = userInfo.Permissions;
      this.UserInfo.RedirectURL = '/dashboard';
      //this.UserInfo.nNotify = userInfo.nNotify;
      // var modules = this.UserInfo.Permissions.map((x:any) => x.ModuleId).filter((value:any, index:any, self:any) => self.indexOf(value) === index);
      // var listModule:any =[];
      // for(var i = 0; i < modules.length; i++){
      //   var oModule : {ModuleId:number, ModuleName:string, ModuleIcon:string, Menus:any} = {ModuleId:0, ModuleName:'', ModuleIcon:'', Menus:[]};
      //   oModule.ModuleId = modules[i];
      //   var oPermission = this.UserInfo.Permissions.filter((x:any)=>x.ModuleId==oModule.ModuleId)[0];
      //   oModule.ModuleName = oPermission!=undefined?oPermission.ModuleName:'';
      //   oModule.ModuleIcon = oPermission!=undefined?oPermission.ModuleIcon:'';
      //   oModule.Menus = this.UserInfo.Permissions.filter((x:any)=>x.ModuleId==oModule.ModuleId);
      //   listModule.push(oModule);
      // }
      // this.UserInfo.ModuleMenus = listModule;
      localStorage.setItem('UserInfo',JSON.stringify(this.UserInfo));
    } else {
      this.logout();
    }
    return of(true).pipe(delay(1000),tap(() => (this.UserInfo.IsLogIn)));
  }

  logout(): void {
    this.reset();
    localStorage.removeItem('UserInfo');
    //location.reload();
  }

  reset() {
    this.UserInfo.IsLogIn = false;
    this.UserInfo.UserName = '';
    this.UserInfo.Token = '';
    this.UserInfo.UserID = 0;
    this.UserInfo.RedirectURL = '/login';
    //this.UserInfo.nNotify = 0;
    //this.UserInfo.Menu = this.resetMenu();
    //this.UserInfo.ModuleMenus = [],
    //this.UserInfo.Permissions = []
  }

}

import { CanActivateFn, RouterState } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //#region authentication
  
  if (authService.UserInfo.IsLogIn) {
    //#region authorization
    if(state.url=='' || state.url=='/dashboard') {
      return true;
    }else{
      return true;
    }
    // var oMenu = authService.UserInfo.Permissions.filter((x:any)=>x.MenuPath==state.url && x.CanView==true)[0];
    // if(oMenu != undefined){
    //   authService.UserInfo.Menu = oMenu;
    //   return true;
    // }
    //#endregion
  }
  return router.parseUrl('/login'); // Redirect to the login page
  //#endregion
  
};

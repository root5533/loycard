import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TwoColumnsLayoutComponent } from './layouts/2-columns-layout/2-columns-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';// developer

import { TWO_COLUMN_ROUTES } from "./shared/routes/2-columns-layout.routes";
import { DASHBOARD_ROUTES } from "./shared/routes/dashboard-layout.routes";// developer
import { USER_ROUTES } from "./shared/routes/user.routes";// developer 
import { OFFER_ROUTES } from './shared/routes/offer.routes';// developer 
import { PROMOTION_ROUTES } from './shared/routes/promotion.routes';// developer 

import { LoginComponent } from './components/auth/login/login.component';

import { AuthGuard } from './shared/auth/auth-guard.service';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  { path: '', component: DashboardLayoutComponent, data: { title: '' }, children: DASHBOARD_ROUTES },
  { path: '', component: DashboardLayoutComponent, data: { title: '' }, children: USER_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: DashboardLayoutComponent, data: { title: '' }, children: OFFER_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: DashboardLayoutComponent, data: { title: '' }, children: PROMOTION_ROUTES, canActivate: [AuthGuard] },
  // { path: '', component: TwoColumnsLayoutComponent, data: { title: '' }, children: TWO_COLUMN_ROUTES, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}

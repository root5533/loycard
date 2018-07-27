import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesrepAddComponent } from './salesrep-add/salesrep-add.component';
import { VendorAddComponent } from './vendor-add/vendor-add.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SalesrepListComponent } from 'app/components/user/salesrep-list/salesrep-list.component';
import { VendorCardAddComponent } from 'app/components/user/vendor-card-add/vendor-card-add.component';
import { ProfileComponent } from './profile/profile.component';
import { VendorCustomersComponent } from './vendor-customers/vendor-customers.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { SalesrepEditComponent } from './salesrep-edit/salesrep-edit.component';
import { VendorEditComponent } from './vendor-edit/vendor-edit.component';
import { VendorSubscribeComponent } from './vendor-subscribe/vendor-subscribe.component';
import { SalesrepListDownloadComponent } from './salesrep-list-download/salesrep-list-download.component';
import { SalesrepVendorListDownloadComponent } from './salesrep-vendor-list-download/salesrep-vendor-list-download.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'salesrep-add',
        component: SalesrepAddComponent
      },
      {
        path: 'vendor-add',
        component: VendorAddComponent
      },
      {
        path: 'vendor-details/:id',
        component: VendorDetailsComponent
      },
      {
        path: 'vendor-edit/:id',
        component: VendorEditComponent
      },
      {
        path: 'vendor-card-add',
        component: VendorCardAddComponent
      },
      {
        path: 'vendor-subscribe/:id',
        component: VendorSubscribeComponent
      },
      {
        path: 'vendor-list',
        component: VendorListComponent
      },
      {
        path: 'salesrep-list',
        component: SalesrepListComponent
      },
      {
        path: 'sales-rep-edit/:id',
        component: SalesrepEditComponent
      },
      {
        path: 'sales-rep-list-download',
        component: SalesrepListDownloadComponent
      },
      {
        path: 'sales-rep-vendor-list-download/:id',
        component: SalesrepVendorListDownloadComponent
      },
      {
        path: 'customers',
        component: VendorCustomersComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'customers',
        component: VendorCustomersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

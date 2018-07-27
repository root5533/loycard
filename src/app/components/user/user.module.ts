import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, NG_VALIDATORS, Validator,
  Validators, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';

import * as $ from 'jquery';

import { UserRoutingModule } from './user-routing.module';

import { SalesrepAddComponent } from './salesrep-add/salesrep-add.component';
import { VendorAddComponent } from './vendor-add/vendor-add.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EqualValidator } from 'app/directives/equal-validator.directive';
import { SalesrepListComponent } from './salesrep-list/salesrep-list.component';
import { VendorCardAddComponent } from './vendor-card-add/vendor-card-add.component';
import { ProfileComponent } from './profile/profile.component';
import { VendorCustomersComponent } from './vendor-customers/vendor-customers.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { SalesrepEditComponent } from './salesrep-edit/salesrep-edit.component';
import { VendorEditComponent } from './vendor-edit/vendor-edit.component';
import { VendorSubscribeComponent } from './vendor-subscribe/vendor-subscribe.component';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { TextMaskModule } from 'angular2-text-mask';
import { SalesrepListDownloadComponent } from './salesrep-list-download/salesrep-list-download.component';
import { SalesrepVendorListDownloadComponent } from './salesrep-vendor-list-download/salesrep-vendor-list-download.component';

import {MyDatePickerModule} from 'mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    UserRoutingModule,
    TextMaskModule,
    MyDatePickerModule
  ],
  declarations: [
    SalesrepAddComponent,
    VendorAddComponent,
    VendorListComponent,
    ChangePasswordComponent,
    EqualValidator,
    SalesrepListComponent,
    VendorCardAddComponent,
    ProfileComponent,
    VendorCustomersComponent,
    VendorDetailsComponent,
    SalesrepEditComponent,
    VendorEditComponent,
    VendorSubscribeComponent,
    jqxGridComponent,
    SalesrepListDownloadComponent,
    SalesrepVendorListDownloadComponent,
    //jqxButtonComponent
  ]
})
export class UserModule { }

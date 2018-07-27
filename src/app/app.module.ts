import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, NG_VALIDATORS, Validator,
    Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { TwoColumnsLayoutComponent } from './layouts/2-columns-layout/2-columns-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component'; // developer
import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';

import * as $ from 'jquery';

// firebase
import { firebaseConfig } from '../environments/firebase.config';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import * as firebase from 'firebase';
// firebase

import { LoginComponent } from './components/auth/login/login.component';
import { VendorService } from 'app/components/user/vendor.service';
import { SalesrepService } from './components/user/salesrep.service';
import { PaymentService } from 'app/components/user/payment.service';
import { OfferService } from 'app/components/offer/offer.service';
import { PromotionService } from 'app/components/promotion/promotion.service';
import { SubscriptionService } from './components/user/subscription.service';
import { WeatherService } from './weather.service';

import {MyDatePickerModule} from 'mydatepicker';
import{ Broadcaster } from './shared/broadcaster';

@NgModule({
    declarations: [
        AppComponent,
        TwoColumnsLayoutComponent,
        DashboardLayoutComponent,
        LoginComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        NgxDatatableModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        SharedModule,
        NgbModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        MyDatePickerModule
    ],
    providers: [
        AuthService,
        AuthGuard,
        VendorService,
        SalesrepService,
        PaymentService,
        SubscriptionService,
        OfferService,
        PromotionService,
        WeatherService,
        Broadcaster
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

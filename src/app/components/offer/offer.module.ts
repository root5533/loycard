import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validator } from '@angular/forms';

import { OfferRoutingModule } from './offer-routing.module';
import { OfferAddComponent } from './offer-add/offer-add.component';
import { OfferListComponent } from './offer-list/offer-list.component';


@NgModule({
  imports: [
    CommonModule,
    OfferRoutingModule,
    FormsModule
  ],
  declarations: [OfferAddComponent, OfferListComponent]
})
export class OfferModule { }

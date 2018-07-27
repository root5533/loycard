import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validator, NgForm } from '@angular/forms';
import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionAddComponent } from './promotion-add/promotion-add.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';

@NgModule({
  imports: [
    CommonModule,
    PromotionRoutingModule,
    FormsModule
  ],
  declarations: [PromotionAddComponent, PromotionListComponent]
})
export class PromotionModule { }

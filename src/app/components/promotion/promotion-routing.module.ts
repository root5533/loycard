import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionAddComponent } from './promotion-add/promotion-add.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'promotion-add',
        component: PromotionAddComponent
      },
      {
        path: 'promotion-list',
        component: PromotionListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }

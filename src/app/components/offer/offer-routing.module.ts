import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferAddComponent } from 'app/components/offer/offer-add/offer-add.component';
import { OfferListComponent } from 'app/components/offer/offer-list/offer-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
          path: 'offer-add',
          component: OfferAddComponent
      },
      {
        path: 'offer-list',
        component: OfferListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferRoutingModule { }

import { Routes, RouterModule } from '@angular/router';

export const OFFER_ROUTES: Routes = [
    {
        path: '',
        loadChildren: '../app/components/offer/offer.module#OfferModule'
    },
];
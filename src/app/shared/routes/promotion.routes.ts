import { Routes, RouterModule } from '@angular/router';

export const PROMOTION_ROUTES: Routes = [
    {
        path: '',
        loadChildren: '../app/components/promotion/promotion.module#PromotionModule'
    },
];
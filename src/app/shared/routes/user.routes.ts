import { Routes, RouterModule } from '@angular/router';

export const USER_ROUTES: Routes = [
    {
        path: '',
        loadChildren: '../app/components/user/user.module#UserModule'
    },
];
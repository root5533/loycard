import { Routes, RouterModule } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: './pages/dashboard-layout-page/dashboard-layout-page.module#DashboardLayoutPageModule'
    },
    // {
    //     path: 'components',
    //     loadChildren: './components/ui-components.module#UIComponentsModule'
    // },
];
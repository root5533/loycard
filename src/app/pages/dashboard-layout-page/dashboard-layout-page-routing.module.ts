import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardLayoutPageComponent } from './dashboard-layout-page.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutPageComponent,
    data: {
      title: 'Dashboard Layout Page'
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardLayoutPageRoutingModule { }

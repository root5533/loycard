import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import * as $ from 'jquery';
import { DashboardLayoutPageRoutingModule } from "./dashboard-layout-page-routing.module";
import { DashboardLayoutPageComponent } from './dashboard-layout-page.component';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular4-fusioncharts';

@NgModule({
    imports: [
        CommonModule,
        DashboardLayoutPageRoutingModule,
        FormsModule   ,
        FusionChartsModule.forRoot(FusionCharts, Charts, FintTheme)     
    ],
    declarations: [
        DashboardLayoutPageComponent
    ]
})
export class DashboardLayoutPageModule { }

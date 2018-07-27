import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIComponentsRoutingModule } from "./ui-components-routing.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonpModule } from '@angular/http';
import { MatchHeightModule } from "../shared/directives/match-height.directive";

import { ButtonsComponent } from "./buttons/buttons.component";

import { PaginationComponent } from "./pagination/pagination.component";

import { DatepickerComponent } from './datepicker/datepicker.component';



@NgModule({
    imports: [
        CommonModule,
        UIComponentsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        JsonpModule,
        NgbModule,
        MatchHeightModule
    ],
    declarations: [
        ButtonsComponent,
        PaginationComponent,
        DatepickerComponent,

    ],
    providers: [  ],
    entryComponents:[]
})
export class UIComponentsModule { }

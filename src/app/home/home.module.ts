import { MyPopoverComponent } from './../my-popover/my-popover.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { PinchZoomModule } from 'ngx-pinch-zoom';

import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimplePdfViewerModule,
    PinchZoomModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  entryComponents: [MyPopoverComponent],
  declarations: [HomePage, MyPopoverComponent]
})
export class HomePageModule { }

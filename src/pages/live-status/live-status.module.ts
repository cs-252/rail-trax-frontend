import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiveStatusPage } from './live-status';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LiveStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveStatusPage),
    PipesModule,
  ],
})
export class LiveStatusPageModule {}

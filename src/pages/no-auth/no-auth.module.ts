import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoAuthPage } from './no-auth';

@NgModule({
  declarations: [
    NoAuthPage,
  ],
  imports: [
    IonicPageModule.forChild(NoAuthPage),
  ],
})
export class NoAuthPageModule {}

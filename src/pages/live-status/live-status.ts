import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserStatusProvider } from '../../providers/user-status/user-status';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the LiveStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-live-status',
  templateUrl: 'live-status.html',
})
export class LiveStatusPage {
  trainNo: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public usp: UserStatusProvider,
              public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    
  }
 
}

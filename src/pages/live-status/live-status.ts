import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { UserStatusProvider } from '../../providers/user-status/user-status';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription, BehaviorSubject } from 'rxjs';

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
  queried = false;
  trainSubscr: Subscription;
  trainData: BehaviorSubject<any>;
  placeholder = {loaded: false};

  constructor(public navCtrl: NavController, public navParams: NavParams, public usp: UserStatusProvider,
              public afAuth: AngularFireAuth, public afs: AngularFirestore, public alertCtrl: AlertController,
              public uss: UserStatusProvider, public loadingCtrl: LoadingController) {
    this.trainData = new BehaviorSubject<any>({});
  }

  ionViewDidLoad() { }
  
  fromHistory(i) {
    console.log('Queried from history: '+i);
  }

  search() {
    let loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();  
    this.trainSubscr = this.afs.doc('trains/' + 'train' + this.trainNo).snapshotChanges().subscribe(doc => {
      loading.dismiss();
      if(!doc.payload.exists) {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'We don\'t have data of the train with number ' + this.trainNo,
          buttons: ['Dismiss']
        });
        alert.present();
        this.trainSubscr.unsubscribe();
        this.queried = false;
      } else {
        this.trainData.next(doc.payload.data());
        this.queried = true;
        const history:any[] = this.uss.userData.getValue().history;
        let flag = false;
        for(let i=0; i<history.length; i++) {
          if(history[i].searchValue === this.trainNo) {
            history[i].frequency++;
            history[i].timestamp = new Date().getTime();
            flag = true;
            console.log('History found');
            break;
          }
        }
        if(!flag) {
          history.unshift({
            searchValue: this.trainNo,
            frequency: 1,
            timestamp: new Date().getTime()
          });
        }
        this.afs.doc('users/'+this.afAuth.auth.currentUser.uid).update({history}).then(() => {
          console.log('History rewritten');
        });
      }
    });
  }
}

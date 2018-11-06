import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../config';
import { GeoProvider } from '../../providers/geo/geo';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserStatusProvider } from '../../providers/user-status/user-status';

/**
 * Generated class for the SessionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sessions',
  templateUrl: 'sessions.html',
})
export class SessionsPage {
  sessionStep = 0;
  EXAMPLE_RESPONSE = {"total_passengers": 1, "debit": 3, "train": {"days": [{"code": "MON", "runs": "N"}, {"code": "TUE", "runs": "Y"}, {"code": "WED", "runs": "Y"}, {"code": "THU", "runs": "N"}, {"code": "FRI", "runs": "N"}, {"code": "SAT", "runs": "N"}, {"code": "SUN", "runs": "Y"}], "number": "12512", "name": "RAPTISAGAR EXP", "classes": [{"code": "1A", "name": "FIRST AC", "available": "N"}, {"code": "FC", "name": "FIRST CLASS", "available": "N"}, {"code": "CC", "name": "AC CHAIR CAR", "available": "N"}, {"code": "3E", "name": "3rd AC ECONOMY", "available": "N"}, {"code": "2A", "name": "SECOND AC", "available": "Y"}, {"code": "SL", "name": "SLEEPER CLASS", "available": "Y"}, {"code": "2S", "name": "SECOND SEATING", "available": "N"}, {"code": "3A", "name": "THIRD AC", "available": "Y"}]}, "passengers": [{"no": 1, "current_status": "RLWL/-/10/GN", "booking_status": "RLWL/-/16/GN"}], "to_station": {"code": "CNB", "name": "KANPUR CENTRAL", "lat": 26.4547354, "lng": 80.3506961}, "pnr": "4563504461", "doj": "02-01-2018", "boarding_point": {"code": "BZA", "name": "VIJAYAWADA JN", "lat": 16.5087586, "lng": 80.6185102}, "from_station": {"code": "BZA", "name": "VIJAYAWADA JN", "lat": 16.5087586, "lng": 80.6185102}, "response_code": 200, "journey_class": {"code": "3A", "name": null}, "chart_prepared": false, "reservation_upto": {"code": "CNB", "name": "KANPUR CENTRAL", "lat": 26.4547354, "lng": 80.3506961}}
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public http: HttpClient, public loadingCtrl: LoadingController, public geo: GeoProvider, public afAuth: AngularFireAuth,
              public uss: UserStatusProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SessionsPage');
  }

  startSessionRegistration() {
    const prompt = this.alertCtrl.create({
      title: 'Start Session',
      message: "Please enter your PNR number here",
      inputs: [
        {
          name: 'pnrnumber',
          placeholder: 'PNR Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
            this.sessionStep = 0;
          }
        },
        {
          text: 'Go',
          handler: data => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            loading.present();        
            this.fetchPNRStatus(data.pnrnumber).then(res => {
              loading.dismiss();
              this.uss.pnrData = res;
              this.sessionStep = 2;
              loading = this.loadingCtrl.create({
                content: 'Creating your session...'
              });
              loading.present(); 
              this.setUpSessionData().then(res => {
                loading.dismiss();
                if(!res) {
                  let alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'Something went wrong and we received an empty response from our servers',
                    buttons: ['Dismiss']
                  });
                  alert.present();
                  this.sessionStep = 0;
                  this.uss.pnrData = {};
                } else {
                  this.uss.sessionData = res;
                  this.uss.currentSession = true;
                  this.setUpLocationTracking();
                  let alert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Your location is now being tracked to provide info about the train: ' + this.uss.sessionData.trainName,
                    buttons: ['Dismiss']
                  });
                  alert.present();

                }
              }).catch(err => {
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Something went wrong and we were not able to contact our servers',
                  buttons: ['Dismiss']
                });
                alert.present();
                this.sessionStep = 0;
                this.uss.pnrData = {};
              });
            }).catch(err => {
              this.sessionStep = 0;
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Something went wrong and we were not able to confirm your PNR status',
                buttons: ['Dismiss']
              });
              alert.present();
            });
          }
        } 
      ]
    });
    this.sessionStep = 1;
    prompt.present();
  }

  fetchPNRStatus(pnr) {
    if(config.dev) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.EXAMPLE_RESPONSE); 
        }, 1000);
      });
    } else {
      this.http.get('https://api.railwayapi.com/v2/pnr-status/pnr/'+pnr+'/apikey/myapikey'+config.RAILWAY_API_KEY+'/').toPromise();
    }
  }

  setUpSessionData() {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':  'application/json'})
    };
    return this.afAuth.auth.currentUser.getIdToken().then(token => {
      let data = {
        firebaseToken: token,
        uid: this.afAuth.auth.currentUser.uid,
        pnrData: this.uss.pnrData
      };
      if (!config.dev) {
        return this.http.post('api/setup-session', data, httpOptions).toPromise();
      } else {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({trainName: 'RAPTI SAGAR', trainNo:12512 });
          }, 1200);
        })
      }
    });
  }

  setUpLocationTracking() {
    let loading = this.loadingCtrl.create({content: 'Setting up location tracker...'});
    loading.present();
    this.geo.setUpTracking();
    loading.dismiss();
  }

  endSession() {
    this.uss.sessionData = {};
    this.uss.currentSession = false;
    this.uss.pnrData = {};
    this.geo.endTracking();
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':  'application/json'})
    };
    let loading = this.loadingCtrl.create({content: 'Ending your session...'});
    loading.present();
    let prom = new Promise(resolve => {
      this.afAuth.auth.currentUser.getIdToken().then(token => {
        if (!config.dev) {
            let data = {
              firebaseToken: token,
              uid: this.afAuth.auth.currentUser.uid,
              pnrData: this.uss.pnrData
            };
            return this.http.post('api/end-session', data, httpOptions).toPromise().then(obj => {
          });
        } else {
          return new Promise(() => {
            setTimeout(() => { resolve({message: 'success', coins: 200}) }, 700);
          });
        }
      });
    });
    prom.then((res: any) => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Session was successfully ended. You received ' + res.coins + ' coins',
        buttons: ['Yahoo']
      });
      alert.present();
    });
  }
}

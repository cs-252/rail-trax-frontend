import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { GeoProvider } from '../geo/geo';

/*
  Generated class for the UserStatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserStatusProvider {
  public userData = new BehaviorSubject<any>({history: [], loading: true});
  private userAfsSubscription: Subscription = null;
  pnrData = <any>{};
  sessionData = new BehaviorSubject<any>({});
  sessionSubscr: Subscription = null;
  currentSession = false;
  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        console.log(user.uid);
        this.userAfsSubscription = this.afs.doc("users/"+user.uid).snapshotChanges().subscribe(snapshot => {
          this.userData.next(snapshot.payload.data());
        });
        if(!this.sessionSubscr) {
          this.sessionSubscr = this.afs.doc('sessions/'+user.uid).snapshotChanges().subscribe(snapshot => {
            if(snapshot.payload.exists) {
              console.log('session existss');
              this.sessionData.next(snapshot.payload.data()); 
              this.currentSession = true;
            } else {
              console.log('session donot exist');
              this.currentSession = false;
            }
          });
        }
      } else {
        if(this.userAfsSubscription) {
          this.userAfsSubscription.unsubscribe();
          this.userAfsSubscription = null;
        }
        if(this.sessionSubscr) {
          this.sessionSubscr.unsubscribe();
          this.sessionSubscr = null;
        }
        this.userData.next({});
        this.sessionData.next({});
        this.currentSession = false;
      }
    });
    
  }

}

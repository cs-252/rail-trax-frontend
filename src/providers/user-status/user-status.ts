import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';

/*
  Generated class for the UserStatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserStatusProvider {
  public userData = new BehaviorSubject<any>({history: [], loading: true});
  private userAfsSubscription: Subscription = null;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        this.userAfsSubscription = this.afs.doc("users/"+user.uid).snapshotChanges().subscribe(snapshot => {
          this.userData.next(snapshot.payload.data());
        });
      } else {
        if(this.userAfsSubscription) {
          this.userAfsSubscription.unsubscribe();
        }
        this.userData.next({});
      }
    });
  }

}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as anime from 'animejs';
import { UIStateProvider } from '../../providers/ui-state/ui-state';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  constructor(public navCtrl: NavController, public UIState: UIStateProvider,
              public afAuth: AngularFireAuth, public afs: AngularFirestore) { }

  ngAfterViewInit() {
    this.UIState.splashScreenDisplayed.subscribe(val => {
      anime({
        targets: ".login-wrapper > *",
        opacity: [0,1],
        translateY: [30, 0],
        duration: 1500,
        delay: function (e, i) {
          return 2000 + i*100;
        }
      });
    });
  }

  login(p) {
    let provider;
    if(p==='google') { provider = new auth.GoogleAuthProvider() }
    if(p==='facebook') { provider = new auth.FacebookAuthProvider() }
    this.afAuth.auth.signInWithPopup(provider).then((token)=>{
      if(token.additionalUserInfo.isNewUser) {
        this.afs.doc('users/'+token.user.uid).set({
          name: token.user.displayName,
          email: token.user.email,
          photoURL: token.user.photoURL
        }).then(() => {
          console.log('Document created');
        }).catch(err => {
          console.error(err);
        });
      }
    });
  }
}

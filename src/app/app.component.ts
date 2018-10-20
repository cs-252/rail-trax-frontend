import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LiveStatusPage } from '../pages/live-status/live-status';
import { ListPage } from '../pages/list/list';

import { UIStateProvider } from '../providers/ui-state/ui-state';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public loadingCtrl: LoadingController, public UIState: UIStateProvider, public afAuth: AngularFireAuth,
              public afs: AngularFirestore) {
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Live Status', component: LiveStatusPage },
      { title: 'List', component: ListPage }
    ];
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    setTimeout(() => {
      this.UIState.splashScreenDisplayed.next(true);
      this.UIState.currentTitle.next('Home');
    }, 2000);
  }

  openPage(page) { 
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
    this.UIState.currentTitle.next(page.title);
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({content: 'Gearing up...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }

  presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>Lol</div>`,
      duration: 1000,
    });
    loading.onDidDismiss(() => {
      console.log('Loading dismissed');
    });
    loading.present();
  }
} 

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

import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { MenuController } from 'ionic-angular';
import { SessionsPage } from '../pages/sessions/sessions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;
  private bgGeoConfig: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  };

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public loadingCtrl: LoadingController, public UIState: UIStateProvider, public afAuth: AngularFireAuth,
              public afs: AngularFirestore, public menu: MenuController) {
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Live Status', component: LiveStatusPage },
      { title: 'Your Sessions', component: SessionsPage },
      { title: 'List', component: ListPage },
    ];
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.afAuth.authState.subscribe(user => {
        this.menu.enable(user?true: false);
        this.menu.swipeEnable(user?true:false);
        this.UIState.splashScreenDisplayed.next(true);
        this.UIState.currentTitle.next(!user?'Login':'Home');
        console.log(user);
      });
    });
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

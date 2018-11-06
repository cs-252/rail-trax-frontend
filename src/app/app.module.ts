import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LiveStatusPage } from '../pages/live-status/live-status';
import { HomePage } from '../pages/home/home';
import { NoAuthPage } from '../pages/no-auth/no-auth';
import { ListPage } from '../pages/list/list';

import { LiveStatusPageModule } from '../pages/live-status/live-status.module';
import { NoAuthPageModule } from '../pages/no-auth/no-auth.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UIStateProvider } from '../providers/ui-state/ui-state';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserStatusProvider } from '../providers/user-status/user-status';

import { PipesModule } from '../pipes/pipes.module';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { SessionsPage } from '../pages/sessions/sessions';
import { SessionsPageModule } from '../pages/sessions/sessions.module';
import { GeoProvider } from '../providers/geo/geo';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAMalTNucrc4IthuPtdbbXwnzkW0edIwuo",
      authDomain: "rail-trax.firebaseapp.com",
      databaseURL: "https://rail-trax.firebaseio.com",
      projectId: "rail-trax",
      storageBucket: "rail-trax.appspot.com",
      messagingSenderId: "972844574063"
    }),
    AngularFireAuthModule,
    LiveStatusPageModule,
    NoAuthPageModule,
    PipesModule,
    SessionsPageModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp], 
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LiveStatusPage,
    NoAuthPage,
    SessionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UIStateProvider,
    HttpClient,
    AngularFirestore, 
    UserStatusProvider,
    BackgroundGeolocation,
    GeoProvider,
    Geolocation
  ]
})
export class AppModule {}

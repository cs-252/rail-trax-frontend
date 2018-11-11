import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { UserStatusProvider } from '../user-status/user-status';

/*
  Generated class for the GeoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeoProvider {
  private watch;
  private subscr;
  watching = false;

  constructor(public http: HttpClient, private geolocation: Geolocation, private uss: UserStatusProvider) {
    console.log('Hello GeoProvider Provider');
    this.watch = this.geolocation.watchPosition();
  }

  setUpTracking() {
    this.subscr = this.watch.subscribe((data) => {
      console.log('Sending GeoData: ', data);
      this.http.post('api/location-info', {
        geoData: data,
        sessionData: this.uss.sessionData,
        userData: this.uss.userData.getValue()
      });
    });
    return this.watch;
  }

  endTracking() {
    this.subscr.unsubscribe();
  }
}

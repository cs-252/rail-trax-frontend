import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { UserStatusProvider } from '../user-status/user-status';
import { config } from '../../config';

/*
  Generated class for the GeoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeoProvider {
  private watch;
  private subscr = null;
  watching = false;
  sendable = true;

  constructor(public http: HttpClient, private geolocation: Geolocation, private uss: UserStatusProvider) {
    this.watch = this.geolocation.watchPosition();
    this.uss.sessionData.subscribe(el => {
      console.log(el);
      if(el.startTime) {
        this.setUpTracking();
      }
    })
  }

  setUpTracking() {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':  'application/json', responseType: 'json'})
    };
    if(!this.subscr) {
      this.subscr = this.watch.subscribe((geoData) => {
        if(this.sendable) {
        console.log('Sending GeoData: ', geoData);
        let url = 'api/location-info';
        if(config.useProxy)
          url = config.proxyHttp + url;
          let dat = {
            latitude: geoData.coords.latitude,
            longitude: geoData.coords.longitude,
            accuracy: geoData.coords.accuracy,
          }
          let send = {
            geoData: dat,
            sessionData: this.uss.sessionData.getValue(),
            userData: this.uss.userData.getValue()
          };
          console.log(send);
          this.http.post(url, send, httpOptions).toPromise()
              .then (res => {console.log('Sent geo')})
              .catch(err => {console.log('Sending geo failed')});
          this.sendable = false;
          setTimeout(()=>{this.sendable = true}, 5000);
        }
      });
    }
    return this.subscr;
  }

  endTracking() {
    this.subscr.unsubscribe();
    this.subscr = null;
  }
}

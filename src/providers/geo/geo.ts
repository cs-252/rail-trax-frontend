import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

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

  constructor(public http: HttpClient, private geolocation: Geolocation) {
    console.log('Hello GeoProvider Provider');
    this.watch = this.geolocation.watchPosition();
  }

  setUpTracking() {
    this.subscr = this.watch.subscribe((data) => {
      console.log(data);
    });
    return this.watch.subscr;
  }

  endTracking() {
    this.subscr.unsubscribe();
  }
}

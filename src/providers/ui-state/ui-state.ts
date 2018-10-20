import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/*
  Generated class for the UiStateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UIStateProvider {
  public splashScreenDisplayed: BehaviorSubject<boolean>;
  public currentTitle: BehaviorSubject<string>;
  constructor() {
    this.splashScreenDisplayed = new BehaviorSubject<boolean>(false);
    this.currentTitle = new BehaviorSubject<string>("Revving up...");
  }

}

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {MapPage} from "../map/map";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  objective: any;

  constructor(public navCtrl: NavController) {
    this.objective = ""
  }

  openMap () {
    if (this.objective != "")
      this.navCtrl.push(MapPage, {'to': this.objective});
  }
}

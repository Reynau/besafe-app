import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {MapPage} from "../map/map";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  objective: any;
  email: any;

  constructor(public navCtrl: NavController) {
    this.objective = ""
  }

  openMap () {
    console.log(this.email);
    if (this.objective != "" && this.email != "")
      this.navCtrl.push(MapPage, {'to': this.objective, 'email': this.email});
  }
}

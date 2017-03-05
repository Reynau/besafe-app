import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare let google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  directionsService: any;
  directionsDisplay: any;
  path: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.path = [];
  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap(){
    let objective = this.navParams.get('to');
    console.log(objective);
    Geolocation.getCurrentPosition().then(
      position => {
        let actualPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(actualPos);
        let mapOptions = {
          center: actualPos,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.directionsDisplay.setMap(this.map);
        this.route(actualPos, objective);
      },
      error => {
        console.log(error);
      });
  }

  route(from, to) {
    let request = {
      origin: from,
      destination: to,
      travelMode: google.maps.TravelMode.WALKING
    };
    let _self = this;
    this.directionsService.route(request, function(result, status) {
      console.log(result);
      let overpath = result.routes["0"].overview_path;
      overpath.forEach(point => {
        _self.path.push(new google.maps.LatLng(point.lat(), point.lng()))
      });
      if (status == google.maps.DirectionsStatus.OK) {
        _self.directionsDisplay.setDirections(result)
      } else {
        alert("couldn't get directions:" + status)
      }
    })
  }

}

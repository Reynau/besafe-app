import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Geolocation, CallNumber, EmailComposer} from 'ionic-native';

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

  fromPos: any;
  toPos: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.path = [];
    this.fromPos = null;
    this.toPos = null;
  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap(){
    let _self = this;
    this.toPos = this.navParams.get('to');
    let email = this.navParams.get('email');

    Geolocation.getCurrentPosition().then(
      position => {
        _self.fromPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOptions = {
          center: _self.fromPos,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.directionsDisplay.setMap(this.map);
        this.route(_self.fromPos, _self.toPos);
        let watch = Geolocation.watchPosition();
        watch.subscribe((position) => {
          let posLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          _self.map.setCenter(posLatLng);
          for (let i = 0; i < _self.path.length; ++i) {
            let dist = _self.getDistance(_self.path[i], posLatLng);
            if (dist < 5) return
          }
          _self.alarm(_self.fromPos, _self.toPos, posLatLng, email)
        });
      },
      error => {
        console.log(error);
      });
  }

  alarm (from, to, pos, toEmail) {
    EmailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
    });

    let email = {
      to: toEmail,
      cc: '',
      bcc: [],
      attachments: [],
      subject: 'I am far of my way to ' + to,
      body: 'I was going from ' + from + ' to ' + to + ', but something is causing me to go another way.\n' +
      ' My last position was (' + pos.lat() + ',' + pos.lng() + ')',
      isHtml: true
    };

    EmailComposer.open(email);
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

  rad (x) {
    return x * Math.PI / 180;
  }

  getDistance (p1, p2) {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = this.rad(p2.lat() - p1.lat());
    let dLong = this.rad(p2.lng() - p1.lng());
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d; // returns the distance in meter
  }
}

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  stepCounter: number = 0;
  deviceAccn: any = [];
  length: number = 10;
  subscription: any;
  constructor(
    public platform: Platform,
    public deviceMotion: DeviceMotion
  ) {}

  toCount(accnData) {
    let sumAcc = accnData.reduce((a, b) => a + b);
    let meanAcc = sumAcc / accnData.length;
    let userAccn = accnData.map(x => x - meanAcc);
    let x = accnData.map(x => Math.pow((x - meanAcc), 2));
    let y: number = x.reduce((a, b) => a + b);
    let stdDev = Math.sqrt(y / accnData.length);

    for (let count = 0; count < userAccn.length; count++) {
      if (Math.abs(userAccn[count]) - stdDev > 5) {
        this.stepCounter++;        
        break;
      }
    }
  }
  startCounter() {
    this.platform.ready().then(() => {
      this.subscription = this.deviceMotion.watchAcceleration({ frequency: 10 }).subscribe(acc => {
        let acceleration: number = 0;
        acceleration = Math.sqrt(Math.pow(acc.x, 2) + Math.pow(acc.y, 2) + Math.pow(acc.z, 2));
        if (acceleration > 9.8) {
          this.deviceAccn.push(acceleration);
        }
        if (acceleration < 9.8 && this.deviceAccn.length >= this.length) {
          let accnData = this.deviceAccn.slice();
          this.deviceAccn = [];
          setTimeout(() => {
              this.toCount(accnData); 
          }, 0);
        }
      });
    });
  }
  StopCounter() {
    this.subscription.unsubscribe();
  }
  resetCount() {
    this.stepCounter = 0;
  }
}

import { Component } from '@angular/core';
import { Services } from '../service/services';

@Component({
  standalone: true,
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  alertOpen = false;
  message = '';

  constructor(private alertService: Services) {
    this.alertService.alert$.subscribe((data: any) => {
      this.alertOpen = data.open;
      this.message = data.message;
    });
  }

  closeAlert() {
    this.alertService.hide();
  }
}

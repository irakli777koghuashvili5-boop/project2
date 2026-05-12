import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Services } from '../service/services';

@Component({
  standalone: true,
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {

  constructor(public alertService: Services) {}

  closeAlert() {
    this.alertService.hideAlert();
  }
}
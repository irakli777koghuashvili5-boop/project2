import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Services } from '../service/services';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink, FormsModule],
  standalone: true,
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  passAndInp: boolean = false;
  PassText(){
    this.passAndInp = !this.passAndInp;
  }
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alert: Services,
    private ngZone : NgZone
  ) {}

  SignIn(form: any) {
    this.api
      .postAll(`/api/auth/login`, {
        ...form.value,
      })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.alert.showAlert('Logged in successfully');
          localStorage.setItem('accessToken', resp.data.accessToken);
          localStorage.setItem('refreshToken', resp.data.refreshToken);
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigateByUrl('/home');
          }, 300);
          this.cdr.detectChanges();
        },
        error: (err) => {
            if (err.status === 400) {
              this.alert.showAlert('Invalid email or password');
            } else if (err.status === 404) {
              this.alert.showAlert('User not found');
            } else if (err.status === 406) {
              this.alert.showAlert('Email not verified code sent to email');
            } else if (err.status === 401) {
              this.alert.showAlert('Invalid email or password');
            }
        },
      });
  }
}

import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [FormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail {
  ELmail: any = localStorage.getItem(`email`);

  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alert: Services,
  ) {}

  verifyEmail(form: any) {
    this.api
      .putAll(`/api/auth/verify-email`, {
        email: localStorage.getItem(`email`),
        ...form.value,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.alert.showAlert('Now log in');
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigateByUrl('/log-in');
          }, 1000);
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 401) {
            this.api.refreshToken().subscribe({
              next: (res: any) => {
                console.log(res);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                this.cdr.detectChanges();
                this.verifyEmail(form);
              },
              error: (err) => {
                console.log(err);
              },
            });
          }
        },
      });
  }

  resendCode() {
    this.api.postAll(`/api/auth/resend-email-verification/${this.ELmail}`, {}).subscribe({
      next: (res) => {
        console.log(res);
        this.alert.showAlert(`Verification code resent to ${this.ELmail}`)
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.resendCode();
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    });
  }
}

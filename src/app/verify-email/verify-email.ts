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
          alert('Now Log In');
          this.router.navigateByUrl('/log-in');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  resendCode(){
    this.api.postAll(`/api/auth/resend-email-verification/${this.ELmail}`, {})
    .subscribe({
      next: (res) => {
        console.log(res);
        alert(`code has been resent to ${this.ELmail}`)
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}

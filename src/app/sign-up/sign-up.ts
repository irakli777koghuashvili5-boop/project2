
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Services } from '../service/services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule],
  standalone: true,
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  passAndInp: boolean = false;
upform: any;
  PassText() {
    this.passAndInp = !this.passAndInp;
  }
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}
  register(form: any) {
    this.api
      .postAll(`/api/auth/register`, {
        ...form.value

      })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp.data.token) {
            localStorage.setItem(`email`, form.value.email);
            alert(`verify your email`)
            this.router.navigateByUrl('/verify-email');
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}

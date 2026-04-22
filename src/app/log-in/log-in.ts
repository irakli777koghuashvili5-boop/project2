import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Services } from '../service/services';

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
  ) {}
  password: string = '';
  email: string = '';
  SignIn() {
    this.api
      .postAll(`/api/auth/login`, {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp) {
            localStorage.setItem('accessToken', resp.data.accessToken);
            localStorage.setItem('refreshToken', resp.data.refreshToken);
            alert(`Logged in successfully`);
            this.router.navigate(['/home']);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}

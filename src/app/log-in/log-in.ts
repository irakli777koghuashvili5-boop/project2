import { ChangeDetectorRef, Component } from '@angular/core';
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
  ) {}

  SignIn(form: any) {
    this.api
      .postAll(`/api/auth/login`, {
        ...form.value
      })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
           this.alert.showAlert("Logged in successfully");
          if (resp) {
            localStorage.setItem('accessToken', resp.data.accessToken);
            localStorage.setItem('refreshToken', resp.data.refreshToken);
            this.cdr.detectChanges()
            setTimeout(() => {
              this.router.navigateByUrl('/home');
            }, 1200);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          if(err.status === 400){
            this.alert.showAlert("Invalid email or password") 
            this.cdr.detectChanges();
          }
        },
      });
  }
}

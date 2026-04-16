import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Services } from '../service/services';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink, FormsModule],
  standalone: true,
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  constructor(private api: Services, private cdr: ChangeDetectorRef){}
  password: string = '';
  email: string = '';
  SignIn(){
    this.api.postAll(`/api/auth/login`, {
      "email": this.email, 
      "password": this.password
    }).subscribe({
      next: ((resp: any) => {
        console.log(resp);
        localStorage.setItem('access_token', resp.access_token);
        localStorage.setItem('refresh_token', resp.refresh_token); 
        this.cdr.detectChanges();
      }),
      error: (err => {
        console.log(err);
      })
    });
  }
}

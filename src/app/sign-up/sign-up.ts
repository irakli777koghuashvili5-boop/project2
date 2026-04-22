import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from "@angular/router";
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
  PassText(){
    this.passAndInp = !this.passAndInp;
  }
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  constructor(private api: Services, private cdr: ChangeDetectorRef) {}
  register(){
    this.api
      .postAll(`/api/auth/register`, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}

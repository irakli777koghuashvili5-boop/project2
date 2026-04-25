import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Services } from '../service/services';

@Component({
  selector: 'app-recover-passcode',
  imports: [FormsModule],
  templateUrl: './recover-passcode.html',
  styleUrl: './recover-passcode.scss',
})
export class RecoverPasscode {
  constructor(private api: Services, private cdr: ChangeDetectorRef) {}
  forgotPass(form: any){
    this.api.postAll(`/api/auth/forgot-password/${form.value.email}`, {})
    .subscribe({
      next: (res) => {
        console.log(res);
        alert("recovery code has been sent to your email: " + form.value.email)
       },
      error: (err) => {console.log(err);}
    })
  }
}

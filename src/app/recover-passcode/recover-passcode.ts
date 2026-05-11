import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Services } from '../service/services';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-recover-passcode',
  imports: [FormsModule],
  templateUrl: './recover-passcode.html',
  styleUrl: './recover-passcode.scss',
})
export class RecoverPasscode {

  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private alert: Services,
  ) {}
  forgotPass(form: any) {
    this.api.postAll(`/api/auth/forgot-password/${form.value.email}`, {}).subscribe({
      next: (res) => {
        console.log(res);
        this.alert.showAlert(`Recover password link sent to ${form.value.email}`)
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
              this.forgotPass(form);
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

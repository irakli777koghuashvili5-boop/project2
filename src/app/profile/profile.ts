import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private alert: Services,
    private refreshHeader : Services
  ) {}
  activeSection: 'personal' | 'password' | 'account' = 'personal';

  setSection(section: 'personal' | 'password' | 'account') {
    this.activeSection = section;
  }

  ngOnInit() {
    this.getData();
  }
  userData: any;
  getData() {
    this.api.getAll(`/api/users/profile`).subscribe({
      next: (resp: any) => {
        this.userData = resp.data;
        console.log(this.userData);
        this.cdr.detectChanges();
      },
      error: (err) => {
        if(err.status === 401){
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.getData();
            },
            error: (err) => {
              console.log(err);
            }
          })
        }
      },
    });
  }
  saveChanges(form: NgForm) {
    this.alert.showAlert('Changes saved successfully!');
    this.cdr.detectChanges();

    console.log(form.value);
    this.api.putAll(`/api/users/edit`, form.value)
    .subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.api.getAll(`/api/users/me`).subscribe({
          next: (userResp: any) => {
            console.log(userResp.data.firstName);
            this.refreshHeader.setUser(userResp.data);
          },
          error: (err) => {
            console.log(err);
          }
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
          if(err.status === 401){
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.saveChanges(form);
            },
            error: (err) => {
              console.log(err);
            }
          })
        }
      },
    })
  }
  passChange(form: NgForm){
    console.log(form.value);
    this.api.putAll(`/api/users/change-password`, form.value)
    .subscribe({
      next: (res=> {
        console.log(res);
      }),
      error: (err) => {
        if (err.status === 401) {
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.passChange(form);
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    })
    
  }
  deleteData(){
    this.api.deleteAll(`/api/users/delete`).subscribe({
      next: (res=> {
        console.log(res);
      }),
      error: (err => {
        if (err.status === 401) {
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.deleteData();
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      })
    })
  }
}

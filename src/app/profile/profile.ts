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
        console.log(err);
      },
    });
  }
  saveChanges(form: NgForm) {
    alert('Changes saved successfully!');
    console.log(form.value);
    this.api.putAll(`/api/users/edit`, form.value)
    .subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
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
        console.log(err);
      },
    })
    
  }
  deleteData(){
    this.api.deleteAll(`/api/users/delete`).subscribe({
      next: (res=> {
        console.log(res);
      }),
      error: (err => {
        console.log(err);
      })
    })
  }
}

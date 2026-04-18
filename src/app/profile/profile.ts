import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  constructor(private api: Services, private cdr: ChangeDetectorRef) {}
  activeSection: 'personal' | 'password' | 'account' = 'personal';

  setSection(section: 'personal' | 'password' | 'account') {
    this.activeSection = section;
  }

  ngOnInit(){
    this.api.getAll(`/api/users/me`).subscribe({
      next: (resp) => {
        console.log(resp);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }




  editData(){
    this.api.putAll(`/api/users/edit`, {
      firstName: 'string',
      lastName: 'string',
      phoneNumber: 'string',
      picture: 'string',
      address: 'string',
      age: 0,
    });
  }
}

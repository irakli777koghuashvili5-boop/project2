import { ChangeDetectorRef, Component, ElementRef, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Services } from '../service/services';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen: boolean = false;
  isProfileMenuOpen: boolean = false;
  userName: string = '';
  constructor(
    private el: ElementRef,
    private router: Router,
    private api: Services,
    private cdr: ChangeDetectorRef,
    private alert: Services,
    private refreshHeader: Services,
  ) {}

  ngOnInit() {

    this.getUser();
  }



  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  getUser() {
    this.api.getAll(`/api/users/me`).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.userName = resp.data.firstName;
        this.refreshHeader.setUser(resp.data);
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
              this.getUser();
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    });
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  get isLoggedIn(): boolean {
    if (localStorage.getItem('accessToken')) {
      return true;
    }
    return false;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }

  logOut() {
    this.alert.showAlert('Logged out successfully');
    this.cdr.detectChanges();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/home']);
  }
}

import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen: boolean = false;
  isProfileMenuOpen = false;
  constructor(private el: ElementRef, private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
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

  logOut(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    alert(`Logged out successfully`);
    this.router.navigate(['/home']);
  }
}

import { ChangeDetectorRef, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Services {
  constructor(private http: HttpClient) {}
  baseURL = `https://restaurantapi.stepacademy.ge`;
  private getHeaders() {
    return {
      'X-API-KEY': 'cfe71798-dfb0-40ff-bba6-548eb575e662',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    };
  }
  getAll(url: string, params?: HttpParams) {
    return this.http.get(this.baseURL + url, {
      headers: this.getHeaders(),
      params,
    });
  }
  postAll(url: string, body: any) {
    return this.http.post(this.baseURL + url, body, {
      headers: this.getHeaders(),
    });
  }
  putAll(url: string, body: any) {
    return this.http.put(this.baseURL + url, body, {
      headers: this.getHeaders(),
    });
  }
  deleteAll(url: string) {
    return this.http.delete(this.baseURL + url, {
      headers: this.getHeaders(),
    });
  }
  refreshToken() {
    return this.http.post(
      this.baseURL + `/api/auth/refresh-access-token/${localStorage.getItem('refreshToken')}`,
      {},
      {
        headers: {
          'X-API-KEY': 'cfe71798-dfb0-40ff-bba6-548eb575e662',
          'Content-Type': 'application/json',
        },
      },
    );
  }

  private alertState = new BehaviorSubject<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  alert$ = this.alertState.asObservable();

  showAlert(message: string) {
    this.alertState.next({
      open: true,
      message: message,
    });
  }

  hideAlert() {
    this.alertState.next({
      open: false,
      message: '',
    });
  }

  private loaderState = new BehaviorSubject<{ open: boolean }>({
    open: false,
  });

  loader$ = this.loaderState.asObservable();

  showLoader() {
    this.loaderState.next({
      open: true,
    });
  }
  hideLoader() {
    this.loaderState.next({
      open: false,
    });
  }

  user = signal<any>(null);
  setUser(user: any) {
    this.user.set(user);
  }

  clearUser() {
    this.user.set(null);
  }

  cartNum = signal<number>(0);

  setCartItem(count: number) {
    this.cartNum.set(count);
  }

  refreshCartCount() {
    this.getAll('/api/cart').subscribe({
      next: (resp: any) => {
        this.cartNum.set(resp.data.totalItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}

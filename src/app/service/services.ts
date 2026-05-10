import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getAll(url: string) {
    return this.http.get(this.baseURL + url, {
      headers: this.getHeaders(),
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

  show(message: string) {
    this.alertState.next({
      open: true,
      message: message,
    });
  }

  hide() {
    this.alertState.next({
      open: false,
      message: '',
    });
  }
 
}

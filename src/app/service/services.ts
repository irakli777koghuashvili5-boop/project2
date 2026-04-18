import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Services {
  constructor(private http: HttpClient) {}
  baseURL = `https://restaurantapi.stepacademy.ge`;
  getAll(url: string) {
    return this.http.get(this.baseURL + url, {
      headers: {
        'X-API-KEY': 'a6778c7c-fe28-4945-8097-f97ad4cb5446',
      },
    });
  }
  postAll(url: string, body: any) {
    return this.http.post(this.baseURL + url, body, {
      headers: {
        'X-API-KEY': 'a6778c7c-fe28-4945-8097-f97ad4cb5446',
      },
    });
  }
  putAll(url: string, body: any) {
    return this.http.put(this.baseURL + url, body, {
      headers: {
        'X-API-KEY': 'a6778c7c-fe28-4945-8097-f97ad4cb5446',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    });
  }
}

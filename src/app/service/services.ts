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
         'X-API-KEY': '21a7c00e-2646-44fc-a137-bc51df9e8287'
      }
    });
  }
}

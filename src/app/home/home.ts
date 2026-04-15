import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [NgxSliderModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private api: Services, private cdr: ChangeDetectorRef) {}
  DisplayProducts: any = [];
  ngOnInit() {
    this.api.getAll(`/api/products/filter?take=6&page=1&maxPrice=500&minPrice=0&query=&rate=0`)
    .subscribe({
      next: (res: any) => {
        console.log(res.data.products);
        this.DisplayProducts = res.data.products;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err), 
    })
  }
  
}

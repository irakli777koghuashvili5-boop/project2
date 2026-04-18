import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [NgxSliderModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  getStars(rating: number): string {
    let validRating = Math.max(0, rating || 0);
    let filledStars = '⭐'.repeat(validRating);
    let emptyStars = '☆'.repeat(validRating === 5 ? 5 - validRating : 6 - validRating);
    return filledStars + emptyStars;
  }
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}
  DisplayProducts: any = [];
  ngOnInit() {
    this.api
      .getAll(`/api/products/filter?take=6&page=1&maxPrice=500&minPrice=0&query=&rate=0`)
      .subscribe({
        next: (res: any) => {
          console.log(res.data.products);
          this.DisplayProducts = res.data.products;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
  }
  addToCart(id: number) {
    this.api
      .postAll(`/api/cart/add-to-cart`, {
        productId: id,
        quantity: 1,
      })
      .subscribe({
        next: (res: any) => {
          alert('Product added to cart');
          this.cdr.detectChanges();
          this.router.navigate(['/cart']);
        },
        error: (err) => console.error(err),
      });
  }
}

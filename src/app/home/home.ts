import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Services } from '../service/services';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Loader } from '../loader/loader';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-home',
  imports: [NgxSliderModule, FormsModule, RouterLink, Loader],
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
    private alert: Services,
    private loader: Services
  ) {}
  DisplayProducts: any = [];
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showScrollBtn: boolean = false;

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollBtn = window.scrollY > 300;
  }
  getProduct(){
    this.loader.showLoader();

     this.api
       .getAll(`/api/products/filter?take=6&page=1`)
       .pipe(
         finalize(() => {
           this.loader.hideLoader();
           this.cdr.detectChanges();
         })
       )
       .subscribe({
         next: (res: any) => {
           console.log(res.data.products);
           this.DisplayProducts = res.data.products;
    
           this.cdr.detectChanges();
         },
         error: (err) => console.error(err),
       });
  }

  ngOnInit() {
    this.getProduct();
  }
  addToCart(id: number) {
    if (!localStorage.getItem('accessToken')) {
      this.alert.showAlert('log in first');
      this.router.navigate(['/log-in']);
    }
    this.api
      .postAll(`/api/cart/add-to-cart`, {
        productId: id,
        quantity: 1,
      })
      .subscribe({
        next: (res: any) => {
          this.alert.showAlert('Product added to cart');
          this.api.refreshCartCount();
          this.cdr.detectChanges();
          this.router.navigate(['/cart']);
        },
        error: (err) => console.error(err),
      });
  }
}

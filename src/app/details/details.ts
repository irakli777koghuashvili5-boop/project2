import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  getStars(rating: number): string {
    let validRating = Math.max(0, rating || 0);
    let filledStars = '⭐'.repeat(validRating);
    let emptyStars = '☆'.repeat(validRating === 5 ? 5 - validRating : 6 - validRating);
    return filledStars + emptyStars;
  }
  productId: string | null = null;
  products: any = [];
  relatedProducts: any = {};
  catId: number = 0;
  MightLike: any = [];
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  showProduct() {
    this.route.queryParams.subscribe((par: any) => {
      this.productId = par['id'];

      if (this.productId) {
        this.api.getAll(`/api/products/${this.productId}`).subscribe({
          next: (res: any) => {
            this.products = res.data;
            this.relatedProducts = res;
            if (res.data && res.data.categoryId) {
              this.getRelatedProducts(res.data.categoryId);
            }

            this.cdr.detectChanges();
          },
          error: (err) => console.error(err),
        });
      }
    });
  }
  qty: number = 1;

  updateQty(delta: number) {
    const newQty = this.qty + delta;
    if (newQty < 1) return;
    this.qty = newQty;
  }

  ngOnInit() {
    this.showProduct();
  }
  getRelatedProducts(id: number) {
    this.api.getAll(`/api/products/filter/?take=4&page=1&categoryId=${id}`).subscribe({
      next: (res: any) => {
        console.log(res.data.products);
        this.MightLike = res.data.products.filter((el: any) => el.name !== this.products.name);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
  addToCart() {
    this.api
      .postAll(`/api/cart/add-to-cart`, {
        productId: this.productId,
        quantity: this.qty,
      })
      .subscribe({
        next: (res: any) => {
          alert(`${this.qty} ${this.products.name} added to cart`);
          this.cdr.detectChanges();
          this.router.navigate(['/cart']);
        },
        error: (err) => console.error(err),
      });
  }
  addLikedIntoCart(id: number){
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

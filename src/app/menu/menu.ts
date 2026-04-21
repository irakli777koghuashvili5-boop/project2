import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Services } from '../service/services';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-menu',
  imports: [NgxSliderModule, FormsModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  getStars(rating: number): string {
    let validRating = Math.max(0, rating || 0);
    let filledStars = '⭐'.repeat(validRating);
    let emptyStars = '☆'.repeat(validRating === 5 ? 5 - validRating : 6 - validRating);
    return filledStars + emptyStars;
  }
  query: string = '';
  isVegie: boolean = false;
  spiciness: number = 0;
  rating: number = 0;
  isFilterOpen: boolean = false;
  isLoading: boolean = true;

  filters = {
    MinPrice: 0,
    MaxPrice: 500,
  };

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showScrollBtn: boolean = false;

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollBtn = window.scrollY > 300;
  }

  options: Options = {
    floor: 0,
    ceil: 500,
    step: 10,
    translate: (value: number): string => `$${value}`,
  };

  CardInside: any = [];
  currentPage: number = 1;
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}
  ngOnInit() {
    this.loadPage(1);
    this.loadCategory();
    this.TestingLoad();
  }
  loadPage(page: number) {
    this.isLoading = true;
    this.api.getAll(`/api/products?Take=12&Page=${page}`).subscribe({
      next: (res: any) => {
        this.CardInside = res.data.products || [];
        this.currentPage = page;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  onFilterChange() {
    this.isLoading = true;

    let catNum = this.CategoryArr.filter((el) => el.selected === true).map((el) => el.id)[0] || 0;

    if (catNum <= this.CategoryArr.length && catNum > 0) {
      this.api
        .getAll(
          `/api/products/filter?Query=${this.query}&Spiciness=${this.spiciness}&Rate=${this.rating}&MinPrice=${this.filters.MinPrice}&MaxPrice=${this.filters.MaxPrice}&CategoryId=${catNum}&Take=30&Page=1`,
        )
        .subscribe({
          next: (res: any) => {
            this.CardInside = res.data.products || [];
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
    } else {
      this.api
        .getAll(
          `/api/products/filter?Query=${this.query}&Spiciness=${this.spiciness}&Rate=${this.rating}&MinPrice=${this.filters.MinPrice}&MaxPrice=${this.filters.MaxPrice}&Take=30&Page=1`,
        )
        .subscribe({
          next: (res: any) => {
            this.CardInside = res.data.products || [];
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }
  onNext() {
    if (this.currentPage < this.ApplyLimitComponent) {
      this.loadPage(this.currentPage + 1);
    }
  }
  onPrevious() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }
  toggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
    if (this.isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  CategoryArr: any[] = [];
  loadCategory() {
    this.api.getAll(`/api/categories`).subscribe({
      next: (resp: any) => {
        this.CategoryArr = resp.data;
        this.cdr.detectChanges();
        console.log(this.CategoryArr);
      },
      error: (err) => {
        console.log(err);
        this.cdr.detectChanges();
      },
    });
  }
  limitComponent: number = 0;
  ApplyLimitComponent: number = 0;
  TestingLoad() {
    this.api.getAll(`/api/products?Take=100000000&Page=1`).subscribe({
      next: (res: any) => {
        this.limitComponent = res.data.products.length;
        console.log(this.limitComponent);
        this.ApplyLimitComponent = Math.ceil(this.limitComponent / 12);
        console.log(this.ApplyLimitComponent);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
  clearFilters() {
    this.loadPage(1);
  }
  addToCart(id: number) {
    if (!localStorage.getItem('accessToken')) {
      alert('log in first');
      this.router.navigate(['/log-in']);
    }
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

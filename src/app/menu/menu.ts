import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Services } from '../service/services';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { finalize } from 'rxjs';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-menu',
  imports: [NgxSliderModule, FormsModule, RouterLink, Loader],
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
  takeNum: number = 12
  query: string = '';
  isVegie: boolean = false;
  spiciness: number = 0;
  rating: number = 0;
  isFilterOpen: boolean = false;
  needLoad: boolean = false;
  itemsPerPage = 12;
  totalPages = 1;
  hasMore : boolean = false;

  filters = {
    MinPrice: 0,
    MaxPrice: 50,
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
    ceil: 50,
    step: 5,
    translate: (value: number): string => `$${value}`,
  };

  CardInside: any = [];
  currentPage: number = 1;
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alert: Services,
    private loader: Services,
  ) {}
  ngOnInit() {
    this.loadPage(1);
    this.loadCategory();
    // this.TestingLoad();
  }

  loadPage(page: number) {
    this.needLoad = true;
    this.loader.showLoader();

    this.api
      .getAll(`/api/products?Take=${this.takeNum}&Page=${page}`)
      .pipe(
        finalize(() => {
          this.needLoad = false;
          this.loader.hideLoader();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.CardInside = res.data.products || [];
          this.currentPage = page;
          this.hasMore = res.data.hasMore
          this.cdr.detectChanges();
          console.log(this.hasMore);
          
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onFilterChange() {
    this.needLoad = true;
    this.loader.showLoader();
    let catNum = this.CategoryArr.filter((el) => el.selected === true).map((el) => el.id)[0] || 0;
    if (catNum <= this.CategoryArr.length && catNum > 0) {
      this.api
        .getAll(
          `/api/products/filter?Query=${this.query}&Spiciness=${this.spiciness}&Rate=${this.rating}&MinPrice=${this.filters.MinPrice}&MaxPrice=${this.filters.MaxPrice}&CategoryId=${catNum}&Take=${this.takeNum}&Page=${this.currentPage}&vegetarian=${this.isVegie}`,
        )
        .pipe(
          finalize(() => {
            this.needLoad = false;
            this.loader.hideLoader();
          }),
        )
        .subscribe({
          next: (res: any) => {
            this.CardInside = res.data.products || [];
            this.hasMore = res.data.hasMore;
            this.cdr.detectChanges();
            console.log(this.hasMore);
          },
          error: (err) => {
            console.error(err);

            this.cdr.detectChanges();
          },
        });
    } else {
      this.api
        .getAll(
          `/api/products/filter?Query=${this.query}&Spiciness=${this.spiciness}&Rate=${this.rating}&MinPrice=${this.filters.MinPrice}&MaxPrice=${this.filters.MaxPrice}&Take=${this.takeNum}&Page=${this.currentPage}&vegetarian=${this.isVegie}`,
        )
        .pipe(
          finalize(() => {
            this.loader.hideLoader();
          }),
        )
        .subscribe({
          next: (res: any) => {
            this.CardInside = res.data.products || [];
            this.hasMore = res.data.hasMore;
            this.cdr.detectChanges();
            console.log(this.hasMore);
          },
          error: (err) => {
            console.error(err);

            this.cdr.detectChanges();
          },
        });
    }
  }
  onNext() {
    // if (this.currentPage < this.ApplyLimitComponent) {

    // }
    if(this.hasMore){
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

  clearFilters() {
    this.loadPage(1);
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
          this.cdr.detectChanges();
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          if (err.status === 401) {
            this.api.refreshToken().subscribe({
              next: (res: any) => {
                console.log(res);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                this.addToCart(id);
              },
              error: (err) => {
                console.log(err);
              },
            });
          }
        },
      });
  }
}

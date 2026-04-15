import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  productId: string | null = null;
  products: any = [];
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((par: any) => {
      this.productId = par['id'];
      console.log(this.productId);
    });
    if (this.productId) {
    this.api.getAll(`/api/products/${this.productId}`)
    .subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.products = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err), 
    })
  }
  }
}

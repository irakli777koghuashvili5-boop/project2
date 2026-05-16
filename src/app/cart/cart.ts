import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { Loader } from '../loader/loader';
import { finalize } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  imports: [Loader, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private alert: Services,
    private loader: Services,
  ) {}
  ngOnInit() {
    this.getData();
  }
  cartData: any = {};
  textChange: boolean = false;
  Items: number = 0
  getData() {
    this.loader.showLoader();
    this.api.getAll(`/api/cart`)
    .pipe(
      finalize(() => {
        this.loader.hideLoader();
        this.cdr.detectChanges()
      })
    )
    .subscribe({
      next: (resp: any) => {
        if(resp.data.items.length <= 0){
          this.textChange = true;
        }
        console.log(resp.data);
        this.cartData = resp.data;
        this.Items = resp.data.totalItems
        console.log(this.Items);
        this.cdr.detectChanges();
      },
      error: (err) => {
       if (err.status === 401) {
         this.api.refreshToken().subscribe({
           next: (res: any) => {
             console.log(res);
             localStorage.setItem('accessToken', res.data.accessToken);
             localStorage.setItem('refreshToken', res.data.refreshToken);
             this.cdr.detectChanges();
             this.getData();
           },
           error: (err) => {
             console.log(err);
           },
         });
       }
      },
    });
  }
  deleteItem(id: number) {
    this.api.deleteAll(`/api/cart/remove-from-cart/${id}`).subscribe({
      next: (res) => {
        console.log(res);
        this.getData();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.deleteItem(id);
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    });
  }

  checkOut(){
    this.loader.showLoader()
    this.api
      .postAll(`/api/cart/checkout`, {})
      .pipe(
        finalize(() => {
          this.loader.hideLoader();
        }),
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.alert.showAlert("Order Placed");
          this.getData();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          if (err.status === 401) {
            this.api.refreshToken().subscribe({
              next: (res: any) => {
                console.log(res);
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error(err);
              },
            });
          }
        },
      });
  }

  updateQty(id: number, num: number) {
    let item = this.cartData.items.find((i: any) => i.id === id);
    if (!item) return;
    let newQty = item.quantity + num;
    if (newQty < 1) return;
    item.quantity = newQty;
    
    this.cartData.totalPrice = this.cartData.items.reduce((sum : any, i: any) => sum + i.product.price * i.quantity,0,);
    this.cartData.totalItems = this.cartData.items.reduce((sum: any, i : any) => sum + i.quantity, 0);
  
    this.api
      .putAll(`/api/cart/edit-quantity`, {
        itemId: id,
        quantity: newQty,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.getData();
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 401) {
            this.api.refreshToken().subscribe({
              next: (res: any) => {
                console.log(res);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                this.cdr.detectChanges();
                this.updateQty(id,num);
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

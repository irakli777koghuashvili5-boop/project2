import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { CartData, CartItem, CartProduct } from '../models/model';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit() {
    this.getData();
  }
  cartData: any = {};
  getData() {
    this.api.getAll(`/api/cart`).subscribe({
      next: (resp: any) => {
        console.log(resp.data);
        this.cartData = resp.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
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
        console.log(err);
      },
    });
  }

  updateQty(id: number, delta: number) {
    let item = this.cartData.items.find((i: any) => i.id === id);

    if (!item) return;

    let newQty = item.quantity + delta;

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
          console.log(err);
        },
      });
  }
}

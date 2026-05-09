import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  activeTab: 'categories' | 'products' = 'categories';
  categories: any[] = [];
  showDrawer = false;
  catText: string = '';

  showProductModal = false;

  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
    private alert: Services,
  ) {}

  setTab(tab: 'categories' | 'products') {
    this.activeTab = tab;
  }

  openDrawer() {
    this.showDrawer = true;
  }

  deleteCat(id: any) {
    this.api.deleteAll(`/api/categories/${id}`).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alert.show('deleted succesfully');
        this.get_cat();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if(err.status === 401){
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.deleteCat(id);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      },
    });
  }
  edit() {
    this.api
      .putAll(`/api/categories/${this.CategoryId}`, {
        name: this.categoryName,
      })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.cdr.detectChanges();
          this.get_cat();
        },
        error: (err) => {
          if (err.status === 401) {
            this.api.refreshToken().subscribe({
              next: (res: any) => {
                console.log(res);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                this.cdr.detectChanges();
                this.edit();
              },
              error: (err) => {
                console.log(err);
              },
            });
          }
        },
      });
  }
  Products: any;

  closeDrawer() {
    this.showDrawer = false;
  }

  isOpen = false;
  categoryName = '';
  productId: number = 0;
  productToEdit: any;

  CategoryId: any;
  showEditProductModal = false;

  openPeoductEditModal(item: any) {
          this.showEditProductModal = true;
    let info : any
  this.api.getAll(`/api/products/${item.id}`).subscribe({
    next: (res: any) => {
      console.log(res.data);
      info = res.data;
      info.ingredients = Array.isArray(item.ingredients)
        ? item.ingredients.join(', ')
        : (item.ingredients ?? '');

      this.productToEdit = {
        id: item.id,
        name: info.name,
        description: info.description,
        price: info.price,
        image: item.image,
        categoryId: info.categoryId,
        spiciness: info.spiciness ?? 0,
        vegetarian: info.vegetarian,
        method: info.method,
        ingredients: info.ingredients,
      };

      console.log(this.productToEdit);


    
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err),
  });

    
  }

  editProduct(form: any) {
    let ingredientsArray: string[] = this.ing2
      .split(',')
      .map((i: string) => i.trim())
      .filter((i: string) => i.length > 0);

    let payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      categoryId: Number(this.productToEdit.categoryId), 
      spiciness: Number(form.spiciness),
      vegetarian: this.productToEdit.vegetarian,
      method: form.method,
      ingredients: ingredientsArray,
    };

    this.api.putAll(`/api/products/${this.productToEdit.id}`, payload).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alert.show('Edited successfully');
        this.cdr.detectChanges();
        this.closeEditProductModal();
        this.getProducts(this.currentPage);
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.editProduct(form);
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    });
  }

  openModal(item: any) {
    this.isOpen = true;
    this.CategoryId = item.id;
    this.categoryName = item.name
  }

  closeEditProductModal() {
    this.showEditProductModal = false;
  }

  closeModal() {
    this.isOpen = false;
    this.categoryName = '';
  }

  openProductModal() {
    this.showProductModal = true;
    this.resetProductForm();
  }

  closeProductModal() {
    this.showProductModal = false;
    this.resetProductForm();
  }

  resetProductForm() {}

  createCategory() {
    this.api
      .postAll(`/api/categories`, {
        name: this.catText,
      })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.alert.show('succeesfully created');
          this.cdr.detectChanges();
          this.get_cat();
          this.closeDrawer();

        },
        error: (err) => {
          if (err.status === 401) {
            this.api.refreshToken().subscribe({
              next: (res: any) => {
                console.log(res);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                this.cdr.detectChanges();
                this.createCategory();
              },
              error: (err) => {
                console.log(err);
              },
            });
          };
        },
      });
  }
  ing: string = '';

  ing2: string = '';

  deleteProduct(id: any) {
    this.api.deleteAll(`/api/products/${id}`).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alert.show('deleted succesfully');
        this.cdr.detectChanges();
        this.getProducts(this.currentPage);
      },
      error: (err) => {
        if (err.status === 401) {
          this.api.refreshToken().subscribe({
            next: (res: any) => {
              console.log(res);
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              this.cdr.detectChanges();
              this.deleteProduct(id);
            },
            error: (err) => {
              console.log(err);
            },
          });
        };
      },
    });
  }

  createProduct(form: any) {
    let ingredientsArray = this.ing
      .split(',')
      .map((i: string) => i.trim())
      .filter((i: string) => i);

    let payload = {
      ...form,
      ingredients: ingredientsArray,
    };
    (console.log(payload),
      this.api.postAll(`/api/products`, payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.alert.show('succeesfully created');
          this.getProducts(this.currentPage);

          this.closeProductModal();
        },
        error: (err) => {
          if (err.status === 401) {
            this.api.refreshToken().subscribe({
              next: (res: any) => {
                console.log(res);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                this.cdr.detectChanges();
                this.createProduct(form);
              },
              error: (err) => {
                console.log(err);
              },
            });
          }
        },
      }));
  }

  ngOnInit() {
    this.get_cat();
    this.getProducts(this.currentPage);
  }

  get_cat() {
    this.api.getAll(`/api/categories`).subscribe({
      next: (resp: any) => {
        this.categories = resp.data;
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
              this.get_cat();
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    });
  }
  currentPage: number = 1;
  onNext() {
    this.currentPage = this.currentPage + 1;
    this.getProducts(this.currentPage);
  }
  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.getProducts(this.currentPage);
    }
  }

  getProducts(page: any) {
    this.api.getAll(`/api/products?Take=10&Page=${page}`).subscribe({
      next: (resp: any) => {
        this.Products = resp.data.products;
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
              this.getProducts(page);
            },
            error: (err) => {
              console.log(err);
        },
       }
      );
     }
    }
   }
  )
 }
}

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

  // Product modal properties
  showProductModal = false;
  productForm = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    spiciness: 0,
    isVegetarian: false,
    cookingMethod: '',
    ingredients: '',
  };

  constructor(
    private api: Services,
    private cdr: ChangeDetectorRef,
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
        alert('deleted succesfully');
        this.cdr.detectChanges();
        this.get_cat();
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
        error: (err) => console.log(err),
      });
  }
  Products: any;

  closeDrawer() {
    this.showDrawer = false;
  }

  isOpen = false;
  categoryName = '';
  productId : number = 0;
  productToEdit : any

  CategoryId: any;
  showEditProductModal = false;
  openPeoductEditModal() {
    this.showEditProductModal = true;
  }

  editProduct(form: any) {
    console.log(form);
    this.api.putAll(`/api/products/${this.productToEdit.id}`, form).subscribe({
      next: (resp: any) => {
        console.log(resp);
        alert("edited succesfully")
        this.cdr.detectChanges();
        this.getProducts(this.currentPage);
    },
    error: (err) => console.log(err)
  }
  )
  }

  openModal(id: any) {
    this.isOpen = true;
    this.CategoryId = id;
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
          alert('succeesfully created');
          this.cdr.detectChanges();
          this.get_cat();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ing: string = '';

  ingr: any[] = this.ing.split(`,`);

  deleteProduct(id: any) {
    this.api.deleteAll(`/api/products/${id}`).subscribe({
      next: (resp: any) => {
        console.log(resp);
        alert('deleted succesfully');
        this.cdr.detectChanges();
        this.getProducts(this.currentPage);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  createProduct(form: any) {
    this.api.postAll(`/api/products`, form).subscribe({
      next: (res: any) => {
        console.log(res);
        alert('succeesfully created');
        this.getProducts(this.currentPage);
        this.cdr.detectChanges();
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
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
      error: (err) => console.error(err),
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
      error: (err) => console.error(err),
    });
  }
}

export class Card {
  data!: {
    products: [
      {
        id: number;
        name: string;
        description: string;
        vegeterian: boolean;
        spiciness: number;
        rate: number;
        price: number;
        image: string;
        canDelete: boolean;
      },
    ];
    hasMore: boolean;
  };
  meta!: {
    name: string;
    description: string;
    website: string;
    location: string;
    email: string;
  };
}

export class Profile {
  id!: number;
  createdAt!: string;
  updatedAt!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  picture!: string;
  address!: string;
  age!: number;
}
export class LoginUser {
  email!: string;
  password!: string;
}

 export interface CartProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rate: number;
  spiciness: number;
  vegeterian: boolean;
  canDelete: boolean;
}

export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
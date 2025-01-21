export interface Product {
  asin: string;
  title: string;
  imgUrl: string;
  stars: number;
  reviews: number;
  price: number;
  listPrice: number;
  categoryId: number;
  isBestSeller: string;
  boughtInLastMonth: number;
}

export interface CartProduct extends Product {
  isSelected?: boolean;
  quantity: number;
  totalPrice: number;
}

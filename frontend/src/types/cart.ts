import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

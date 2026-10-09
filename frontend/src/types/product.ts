export type ProductCategory =
  | 'hortifruti'
  | 'acougue'
  | 'padaria'
  | 'mercearia'
  | 'limpeza';

export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number; // Em reais (ex: 12.90)
  stockQuantity: number;
  category: ProductCategory;
  imageUrl?: string;
  unit?: string; // ex: 'kg', 'un', 'pct'
  isPromotion?: boolean;
}

export type ProductSortOption =
  | 'default'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc';

export interface ProductFilterParams {
  category?: ProductCategory | 'all';
  search?: string;
  page?: number;
  size?: number;
  sort?: ProductSortOption;
}

export interface PaginatedProducts {
  content: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

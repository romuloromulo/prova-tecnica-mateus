import { create } from 'zustand';
import type { Product } from '../types/product';
import type { CartItem } from '../types/cart';
import { cartService } from '../services/cartService';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, newQuantity: number) => boolean;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  getTotalItems: () => number;
  getSubtotal: () => number;
}

const getStoredCart = (): CartItem[] => {
  const item = localStorage.getItem('mateus_cart');
  if (!item) return [];
  try {
    const parsed = JSON.parse(item);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        Boolean(i && i.product && i.product.id && typeof i.product.price === 'number' && i.quantity > 0)
    );
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('mateus_cart', JSON.stringify(items));
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getStoredCart(),
  isOpen: false,

  addItem: (product: Product, quantity = 1) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((i) => i.product.id === product.id);

    if (existingIndex > -1) {
      const existingItem = currentItems[existingIndex];
      const nextQuantity = existingItem.quantity + quantity;

      if (nextQuantity > product.stockQuantity) {
        return {
          success: false,
          message: `Só temos ${product.stockQuantity} unidades de "${product.name}" no estoque no momento.`,
        };
      }

      const updated = [...currentItems];
      updated[existingIndex] = { ...existingItem, quantity: nextQuantity };
      saveCart(updated);
      set({ items: updated });
      cartService.addItem(product.id, quantity).catch(() => {});
      return { success: true };
    }

    if (quantity > product.stockQuantity) {
      return {
        success: false,
        message: `Só temos ${product.stockQuantity} unidades de "${product.name}" no estoque no momento.`,
      };
    }

    const updated = [...currentItems, { product, quantity }];
    saveCart(updated);
    set({ items: updated });
    cartService.addItem(product.id, quantity).catch(() => {});
    return { success: true };
  },

  removeItem: (productId: number | string) => {
    const updated = get().items.filter((i) => i.product.id !== productId);
    saveCart(updated);
    set({ items: updated });
    cartService.removeItem(productId).catch(() => {});
  },

  updateQuantity: (productId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      get().removeItem(productId);
      return true;
    }

    const currentItems = get().items;
    const existing = currentItems.find((i) => i.product.id === productId);
    if (!existing) return false;

    if (newQuantity > existing.product.stockQuantity) {
      return false;
    }

    const updated = currentItems.map((i) =>
      i.product.id === productId ? { ...i, quantity: newQuantity } : i
    );
    saveCart(updated);
    set({ items: updated });
    cartService.updateQuantity(productId, newQuantity).catch(() => {});
    return true;
  },

  clearCart: () => {
    localStorage.removeItem('mateus_cart');
    set({ items: [] });
    cartService.clearCart().catch(() => {});
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (acc, item) => acc + (item?.product?.price || 0) * (item?.quantity || 1),
      0
    );
  },
}));

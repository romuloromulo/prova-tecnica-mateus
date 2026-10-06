import { api } from './api';
import type { CartItem } from '@/types/cart';

/**
 * Serviço de Carrinho com sincronização de API e fallback resiliente local.
 * Quando o backend Spring Boot estiver conectado, sincroniza com o banco de dados.
 * Enquanto estiver offline, mantém a experiência 100% funcional no navegador.
 */
export const cartService = {
  /**
   * Obtém os itens do carrinho
   */
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await api.get('/cart');
      if (Array.isArray(response.data?.items)) {
        return response.data.items;
      }
      return this.getLocalCart();
    } catch {
      return this.getLocalCart();
    }
  },

  /**
   * Sincroniza o carrinho local com a API do servidor
   */
  async syncCart(items: CartItem[]): Promise<void> {
    try {
      await api.post('/cart/sync', {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
    } catch {
      // Mantém armazenamento local se o backend não estiver respondendo
      this.saveLocalCart(items);
    }
  },

  /**
   * Adiciona um item ao carrinho no backend
   */
  async addItem(productId: number | string, quantity: number): Promise<void> {
    try {
      await api.post('/cart/items', { productId, quantity });
    } catch {
      // Fallback tratado pela store local
    }
  },

  /**
   * Atualiza a quantidade de um item no backend
   */
  async updateQuantity(productId: number | string, quantity: number): Promise<void> {
    try {
      await api.put(`/cart/items/${productId}`, { quantity });
    } catch {
      // Fallback tratado pela store local
    }
  },

  /**
   * Remove um item no backend
   */
  async removeItem(productId: number | string): Promise<void> {
    try {
      await api.delete(`/cart/items/${productId}`);
    } catch {
      // Fallback tratado pela store local
    }
  },

  /**
   * Limpa o carrinho no backend
   */
  async clearCart(): Promise<void> {
    try {
      await api.delete('/cart');
    } catch {
      // Fallback tratado pela store local
    }
  },

  /**
   * Auxiliar para ler localStorage com proteção
   */
  getLocalCart(): CartItem[] {
    try {
      const raw = localStorage.getItem('mateus_cart');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Auxiliar para gravar no localStorage
   */
  saveLocalCart(items: CartItem[]): void {
    try {
      localStorage.setItem('mateus_cart', JSON.stringify(items));
    } catch {
      // Ignora erro de storage quota
    }
  },
};

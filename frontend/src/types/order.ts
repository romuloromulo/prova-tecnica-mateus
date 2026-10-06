import type { CartItem } from './cart';

export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PaymentMethod = 'CADERNINHO' | 'PIX' | 'CARTAO_CREDITO' | 'DINHEIRO';

export interface Order {
  id: string | number;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryAddress?: string;
  notes?: string;
}

export interface PaymentSimulationRequest {
  orderId: string | number;
  simulateStatus: 'APPROVED' | 'REJECTED';
}

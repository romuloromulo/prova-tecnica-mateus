import { api } from './api';
import type {
  Order,
  CreateOrderPayload,
  OrderStatus,
  PaymentSimulationRequest,
} from '@/types/order';
import { generatePixBrCode, detectCardBrand, validateLuhn } from '@/utils/paymentUtils';

const ORDERS_STORAGE_KEY = 'mateus_orders';

const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveOrderLocal = (order: Order): void => {
  try {
    const orders = getStoredOrders();
    const updated = [order, ...orders.filter((o) => o.id !== order.id)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently ignore quota exceeded
  }
};

export const orderService = {
  /**
   * Cria um novo pedido (Consome API Spring Boot com fallback resiliente)
   */
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    try {
      const response = await api.post('/orders', payload);
      if (response.data && response.data.id) {
        saveOrderLocal(response.data);
        return response.data;
      }
      return this.simulateCreateOrder(payload);
    } catch {
      return this.simulateCreateOrder(payload);
    }
  },

  /**
   * Simula a criação de pedido quando o backend estiver offline
   */
  simulateCreateOrder(payload: CreateOrderPayload): Order {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const subtotal = payload.items.reduce(
      (acc, item) => acc + (item.product.price || 0) * (item.quantity || 1),
      0
    );
    const deliveryFee = subtotal >= 120 ? 0 : 9.9;
    const totalAmount = subtotal + deliveryFee;

    let initialStatus: OrderStatus = 'PENDING';
    let failureReason: string | undefined;

    // Lógica para Cartão de Crédito
    let cardDetails = undefined;
    if (payload.paymentMethod === 'CARTAO_CREDITO' && payload.cardData) {
      const cleanNumber = payload.cardData.number.replace(/\D/g, '');
      const brand = detectCardBrand(cleanNumber);
      cardDetails = {
        lastFourDigits: cleanNumber.slice(-4) || '0001',
        brand,
        installments: payload.cardData.installments || 1,
      };

      // Test Cards: 2 = Saldo Insuficiente, 3 = Bloqueio
      if (cleanNumber.endsWith('0002')) {
        initialStatus = 'REJECTED';
        failureReason = 'Transação recusada pelo banco emissor: Saldo insuficiente.';
      } else if (cleanNumber.endsWith('0003')) {
        initialStatus = 'REJECTED';
        failureReason = 'Transação recusada: Bloqueio preventivo de segurança.';
      } else if (validateLuhn(cleanNumber) || cleanNumber.endsWith('0001')) {
        initialStatus = 'APPROVED';
      } else {
        initialStatus = 'REJECTED';
        failureReason = 'Número de cartão inválido pelo algoritmo de verificação bancária.';
      }
    }

    // Lógica para Caderninho Digital (Aprovação imediata de confiança de 1987)
    let caderninhoDetails = undefined;
    if (payload.paymentMethod === 'CADERNINHO') {
      initialStatus = 'APPROVED';
      caderninhoDetails = {
        customerName: payload.shippingAddress.recipientName,
        debitedAmount: totalAmount,
        remainingLimit: Math.max(0, 800 - totalAmount),
      };
    }

    // Lógica para PIX (Geração de QR Code e payload oficial)
    let pixDetails = undefined;
    if (payload.paymentMethod === 'PIX') {
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      pixDetails = {
        qrCodeSvgData: '/mascote/dentinho-carrinho.svg',
        copyPasteKey: generatePixBrCode(orderId, totalAmount),
        expiresAt,
      };
      initialStatus = 'PENDING';
    }

    const order: Order = {
      id: orderId,
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      items: payload.items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: payload.paymentMethod,
      status: initialStatus,
      shippingAddress: payload.shippingAddress,
      pixDetails,
      cardDetails,
      caderninhoDetails,
      failureReason,
    };

    saveOrderLocal(order);
    return order;
  },

  /**
   * Simula a transição de estado de pagamento (ex: Avaliador aprovando PIX ou testando recusa)
   */
  async simulatePayment(request: PaymentSimulationRequest): Promise<Order> {
    try {
      const response = await api.post('/payments/simulate', request);
      if (response.data && response.data.id) {
        saveOrderLocal(response.data);
        return response.data;
      }
      return this.simulateLocalPaymentTransition(request);
    } catch {
      return this.simulateLocalPaymentTransition(request);
    }
  },

  /**
   * Atualiza o status do pedido localmente
   */
  simulateLocalPaymentTransition(request: PaymentSimulationRequest): Order {
    const orders = getStoredOrders();
    const existing = orders.find((o) => o.id === request.orderId);

    const updated: Order = existing
      ? {
          ...existing,
          status: request.simulateStatus,
          failureReason: request.simulateStatus === 'REJECTED' ? request.rejectionReason : undefined,
        }
      : {
          id: request.orderId,
          orderNumber: request.orderId,
          createdAt: new Date().toISOString(),
          items: [],
          subtotal: 0,
          deliveryFee: 0,
          totalAmount: 0,
          paymentMethod: 'PIX',
          status: request.simulateStatus,
          shippingAddress: {
            recipientName: 'Cliente',
            street: 'Rua Principal',
            number: '100',
            neighborhood: 'Centro',
            city: 'São Luís',
            state: 'MA',
            cep: '65075-000',
          },
        };

    saveOrderLocal(updated);
    return updated;
  },

  /**
   * Obtém um pedido pelo ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data) return response.data;
      const orders = getStoredOrders();
      return orders.find((o) => o.id === orderId) || null;
    } catch {
      const orders = getStoredOrders();
      return orders.find((o) => o.id === orderId) || null;
    }
  },
};

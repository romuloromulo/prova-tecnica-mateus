import { api } from './api';
import { cartService } from './cartService';
import type {
  Order,
  CreateOrderPayload,
  OrderStatus,
  PaymentSimulationRequest,
  ShippingAddress,
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
    
  }
};

interface BackendOrderDto {
  id?: number | string;
  orderNumber?: string;
  subtotal?: number;
  deliveryFee?: number;
  totalAmount?: number;
  paymentMethod?: any;
  status?: any;
  failureReason?: string;
  recipientName?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  shippingAddress?: ShippingAddress;
  createdAt?: string;
  items?: any[];
  cardDetails?: any;
  caderninhoDetails?: any;
  pixDetails?: any;
}

function mapBackendOrderToFrontend(data: BackendOrderDto, payload: CreateOrderPayload): Order {
  const shippingAddress: ShippingAddress = {
    recipientName: data.recipientName || data.shippingAddress?.recipientName || payload.shippingAddress.recipientName || 'Cliente Mateus',
    street: data.street || data.shippingAddress?.street || payload.shippingAddress.street || '',
    number: data.number || data.shippingAddress?.number || payload.shippingAddress.number || 'S/N',
    complement: data.complement || data.shippingAddress?.complement || payload.shippingAddress.complement || '',
    neighborhood: data.neighborhood || data.shippingAddress?.neighborhood || payload.shippingAddress.neighborhood || '',
    city: data.city || data.shippingAddress?.city || payload.shippingAddress.city || 'São Luís',
    state: data.state || data.shippingAddress?.state || payload.shippingAddress.state || 'MA',
    cep: data.cep || data.shippingAddress?.cep || payload.shippingAddress.cep || '',
  };

  const calculatedSubtotal = payload.items.reduce((acc, it) => acc + (it.product?.price || 0) * (it.quantity || 1), 0);
  const subtotal = Number(data.subtotal ?? calculatedSubtotal);
  const deliveryFee = Number(payload.deliveryFee !== undefined ? payload.deliveryFee : (data.deliveryFee ?? (subtotal >= 120 ? 0 : 9.9)));
  const discountAmount = Number(payload.discountAmount || 0);
  const totalAmount = Number(payload.totalAmount !== undefined ? payload.totalAmount : (data.totalAmount ?? Math.max(0, subtotal + deliveryFee - discountAmount)));

  let cardDetails = data.cardDetails;
  if (!cardDetails && payload.paymentMethod === 'CARTAO_CREDITO' && payload.cardData) {
    const cleanNumber = payload.cardData.number.replace(/\D/g, '');
    cardDetails = {
      lastFourDigits: cleanNumber.slice(-4) || '0001',
      brand: detectCardBrand(cleanNumber),
      installments: payload.cardData.installments || 1,
    };
  }

  let caderninhoDetails = data.caderninhoDetails;
  if (!caderninhoDetails && payload.paymentMethod === 'CADERNINHO') {
    caderninhoDetails = {
      customerName: shippingAddress.recipientName,
      debitedAmount: totalAmount,
      remainingLimit: 0,
    };
  }

  let pixDetails = data.pixDetails;
  if (!pixDetails && (data.paymentMethod === 'PIX' || payload.paymentMethod === 'PIX')) {
    const orderNum = data.orderNumber || String(data.id || Date.now());
    pixDetails = {
      qrCodeSvgData: '/mascote/dentinho-carrinho.svg',
      copyPasteKey: generatePixBrCode(orderNum, totalAmount),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  return {
    id: String(data.id || data.orderNumber || Date.now()),
    orderNumber: data.orderNumber || String(data.id),
    createdAt: data.createdAt || new Date().toISOString(),
    items: payload.items,
    subtotal,
    deliveryFee,
    discountAmount,
    couponCode: payload.couponCode,
    deliveryType: payload.deliveryType,
    totalAmount,
    paymentMethod: data.paymentMethod || payload.paymentMethod,
    status: (data.status as OrderStatus) || 'APPROVED',
    shippingAddress,
    pixDetails,
    cardDetails,
    caderninhoDetails,
    failureReason: data.failureReason || undefined,
  };
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    try {
      // 1. Sincroniza o carrinho da sessão com o backend antes do checkout
      if (payload.items && payload.items.length > 0) {
        try {
          await cartService.syncCart(payload.items);
        } catch {
          // Segue com a requisição de checkout
        }
      }

      // 2. Chama a API de checkout do Spring Boot
      const response = await api.post('/orders', payload);
      if (response.data && (response.data.id || response.data.orderNumber)) {
        const mapped = mapBackendOrderToFrontend(response.data, payload);
        saveOrderLocal(mapped);
        return mapped;
      }
      return this.simulateCreateOrder(payload);
    } catch {
      return this.simulateCreateOrder(payload);
    }
  },


  simulateCreateOrder(payload: CreateOrderPayload): Order {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const subtotal = payload.items.reduce(
      (acc, item) => acc + (item.product.price || 0) * (item.quantity || 1),
      0
    );
    const deliveryFee = payload.deliveryFee !== undefined ? payload.deliveryFee : (payload.deliveryType === 'pickup' || subtotal >= 120 ? 0 : 9.9);
    const discountAmount = payload.discountAmount || 0;
    const totalAmount = payload.totalAmount !== undefined ? payload.totalAmount : Math.max(0, subtotal + deliveryFee - discountAmount);

    let initialStatus: OrderStatus = 'PENDING';
    let failureReason: string | undefined;

    let cardDetails = undefined;
    if (payload.paymentMethod === 'CARTAO_CREDITO' && payload.cardData) {
      const cleanNumber = payload.cardData.number.replace(/\D/g, '');
      const brand = detectCardBrand(cleanNumber);
      cardDetails = {
        lastFourDigits: cleanNumber.slice(-4) || '0001',
        brand,
        installments: payload.cardData.installments || 1,
      };

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

    let caderninhoDetails = undefined;
    if (payload.paymentMethod === 'CADERNINHO') {
      initialStatus = 'APPROVED';
      caderninhoDetails = {
        customerName: payload.shippingAddress.recipientName,
        debitedAmount: totalAmount,
        remainingLimit: Math.max(0, 800 - totalAmount),
      };
    }

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
      discountAmount,
      couponCode: payload.couponCode,
      deliveryType: payload.deliveryType,
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

  async simulatePayment(request: PaymentSimulationRequest): Promise<Order> {
    const orders = getStoredOrders();
    const existing = orders.find(
      (o) => String(o.id) === String(request.orderId) || o.orderNumber === request.orderId
    );

    try {
      await api.post('/payments/simulate', request);
      if (existing) {
        const updated: Order = {
          ...existing,
          status: request.simulateStatus,
          failureReason: request.simulateStatus === 'REJECTED' ? request.rejectionReason : undefined,
        };
        saveOrderLocal(updated);
        return updated;
      }
      return this.simulateLocalPaymentTransition(request);
    } catch {
      return this.simulateLocalPaymentTransition(request);
    }
  },

  simulateLocalPaymentTransition(request: PaymentSimulationRequest): Order {
    const orders = getStoredOrders();
    const existing = orders.find(
      (o) => String(o.id) === String(request.orderId) || o.orderNumber === request.orderId
    );

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

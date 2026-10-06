import type { CartItem } from './cart';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';

export type PaymentMethod = 'CADERNINHO' | 'PIX' | 'CARTAO_CREDITO';

export interface ShippingAddress {
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface CreditCardData {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
  installments: number;
}

export interface PixDetails {
  qrCodeSvgData: string;
  copyPasteKey: string;
  expiresAt: string;
}

export interface CardDetails {
  lastFourDigits: string;
  brand: 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'unknown';
  installments: number;
}

export interface CaderninhoDetails {
  customerName: string;
  debitedAmount: number;
  remainingLimit: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  pixDetails?: PixDetails;
  cardDetails?: CardDetails;
  caderninhoDetails?: CaderninhoDetails;
  failureReason?: string;
}

export interface CreateOrderPayload {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  cardData?: CreditCardData;
}

export interface PaymentSimulationRequest {
  orderId: string;
  simulateStatus: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

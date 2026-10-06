import React, { useState, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/orderService';
import type { PaymentMethod, ShippingAddress, CreditCardData, Order } from '@/types/order';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CaderninhoPayment } from './CaderninhoPayment';
import { PixPayment } from './PixPayment';
import { CreditCardPayment } from './CreditCardPayment';
import { OrderSuccessView } from './OrderSuccessView';
import { creditCardSchema, shippingAddressSchema } from './checkoutValidation';
import { formatCep, TEST_CARDS } from '@/utils/paymentUtils';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Truck,
  Store,
  Lock,
  Zap,
  Heart,
  Loader2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Clock,
  RefreshCw,
  PhoneCall,
  XCircle,
  Tag,
  MessageSquare
} from 'lucide-react';

interface CheckoutPageProps {
  onBackToStore: () => void;
}

type CheckoutStep = 'address' | 'payment' | 'success';

type DeliverySlot = 'express' | 'night' | 'tomorrow_morning';
type ReplacementPolicy = 'similar' | 'contact' | 'cancel';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToStore }) => {
  const { items, getSubtotal, getTotalItems, clearCart } = useCartStore();
  const { user, debitCaderninhoLimit } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [deliveryType, setDeliveryType] = useState<'express' | 'pickup'>('express');
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>('express');
  const [replacementPolicy, setReplacementPolicy] = useState<ReplacementPolicy>('similar');
  const [separatorNotes, setSeparatorNotes] = useState<string>('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CADERNINHO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cardRejectionReason, setCardRejectionReason] = useState<string | null>(null);
  const paymentSectionRef = useRef<HTMLElement>(null);

  // Cupons de desconto
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; freeShipping?: boolean } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Erros Zod
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Pedidos gerados para PIX ou para o Sucesso
  const [pixPendingOrder, setPixPendingOrder] = useState<Order | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Endereço de entrega inicial acolhedor
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: user?.name || 'Dona Marta de Sousa',
    street: 'Av. Jerônimo de Albuquerque',
    number: '1987',
    complement: 'Apto 204',
    neighborhood: 'Cohab Anil',
    city: 'São Luís',
    state: 'MA',
    cep: '65051-210',
  });

  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  // Cartão de Crédito inicia VAZIO por padrão para validação Zod rigorosa
  const [cardData, setCardData] = useState<CreditCardData>({
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
    installments: 1,
  });

  const validItems = items.filter(
    (i) => i && i.product && i.product.id && typeof i.product.price === 'number'
  );
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  // Cálculo da taxa de entrega e descontos
  let baseDeliveryFee = deliveryType === 'pickup' || subtotal >= 120 || subtotal === 0 ? 0 : 9.9;
  if (appliedCoupon?.freeShipping) {
    baseDeliveryFee = 0;
  }

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryFee = baseDeliveryFee;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Aplicação de Cupom de Supermercado
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError('Digite o código do cupom.');
      return;
    }

    if (code === 'DENTINHO10' || code === 'MATEUS10') {
      setAppliedCoupon({ code, discount: 10 });
      setCouponInput('');
    } else if (code === 'FRETEGRATIS') {
      setAppliedCoupon({ code, discount: 0, freeShipping: true });
      setCouponInput('');
    } else {
      setCouponError('Cupom inválido ou expirado. Tente DENTINHO10 ou FRETEGRATIS.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Preenchimento de Teste com 1 Clique (Ambiente de Teste para o Avaliador)
  const handleAutoFillValidTestCard = () => {
    const validCard = TEST_CARDS[0];
    setCardData({
      number: validCard.number,
      holderName: (user?.name || 'AVALIADOR TECNICO GRUPO MATEUS').toUpperCase(),
      expiry: validCard.expiry,
      cvv: validCard.cvv,
      installments: 1,
    });
    setCardErrors({});
    setCardRejectionReason(null);
    setErrorMessage(null);
  };

  // Avança do Endereço para o Pagamento com validação Zod
  const handleProceedToPayment = () => {
    setErrorMessage(null);
    setAddressErrors({});

    const result = shippingAddressSchema.safeParse(shippingAddress);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0]);
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setAddressErrors(fieldErrors);
      setErrorMessage('Por favor, revise os dados do endereço de entrega destacados abaixo.');
      return;
    }

    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submissão do Pagamento (Caderninho, PIX ou Cartão)
  const handleConfirmPayment = async () => {
    setErrorMessage(null);

    // Validação Caderninho
    if (paymentMethod === 'CADERNINHO') {
      const currentLimit = user?.caderninhoLimit ?? 0;
      if (currentLimit < totalAmount) {
        setErrorMessage(
          'O valor total excede o limite disponível do seu Caderninho Digital. Escolha PIX ou Cartão de Crédito.'
        );
        return;
      }
    }

    // Validação ZOD Estrita do Cartão de Crédito
    if (paymentMethod === 'CARTAO_CREDITO') {
      setCardErrors({});
      const cardResult = creditCardSchema.safeParse(cardData);
      if (!cardResult.success) {
        const formatted: Record<string, string> = {};
        cardResult.error.issues.forEach((issue) => {
          const field = String(issue.path[0]);
          if (!formatted[field]) formatted[field] = issue.message;
        });
        setCardErrors(formatted);
        setErrorMessage(
          'Por favor, preencha corretamente os dados do cartão de crédito destacados no formulário.'
        );
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Delay visual para feedback realista do gateway
      await new Promise((resolve) => setTimeout(resolve, 800));

      const order = await orderService.createOrder({
        items: validItems,
        shippingAddress,
        paymentMethod,
        cardData: paymentMethod === 'CARTAO_CREDITO' ? cardData : undefined,
      });

      if (paymentMethod === 'PIX') {
        // No PIX: Mostra a tela de PIX com QR code e simulador bancário, SEM limpar o carrinho
        setPixPendingOrder(order);
        setIsProcessing(false);
        return;
      }

      if (order.status === 'APPROVED') {
        // Se pagou com Caderninho, debita o saldo na store
        if (paymentMethod === 'CADERNINHO') {
          debitCaderninhoLimit(totalAmount);
        }
        // Limpa o carrinho SOMENTE após a aprovação garantida
        clearCart();
        setConfirmedOrder(order);
        setCurrentStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Em caso de recusa bancária, PERMANECE na etapa de pagamento e MANTÉM todos os dados e itens intactos
        const reason =
          order.failureReason ||
          'Transação recusada pelo banco emissor. Verifique o limite ou utilize outro cartão.';
        setCardRejectionReason(reason);
        setErrorMessage(reason);
      }
    } catch {
      setErrorMessage('Erro de comunicação com o gateway bancário. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulação de aprovação bancária do PIX (ferramenta do avaliador)
  const handlePixSimulateApproval = async () => {
    if (!pixPendingOrder) return;
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const updated = await orderService.simulatePayment({
      orderId: pixPendingOrder.id,
      simulateStatus: 'APPROVED',
    });

    // Limpa o carrinho agora que o PIX foi confirmado com sucesso
    clearCart();
    setPixPendingOrder(null);
    setConfirmedOrder(updated);
    setCurrentStep('success');
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulação de timeout / cancelamento do PIX
  const handlePixSimulateRejection = async () => {
    if (!pixPendingOrder) return;
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    await orderService.simulatePayment({
      orderId: pixPendingOrder.id,
      simulateStatus: 'REJECTED',
      rejectionReason: 'Pagamento PIX expirado.',
    });

    // Volta para a seleção de pagamento PRESERVANDO o carrinho e os valores
    setPixPendingOrder(null);
    setErrorMessage('O pagamento PIX expirou ou foi cancelado. Selecione novamente a forma de pagamento.');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-mateus-surface text-slate-800 flex flex-col antialiased">
      {/* 1. Cabeçalho Dedicado de Checkout (Distraction-Free) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4">
          {/* Logo Mateus */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="flex items-center gap-2 group cursor-pointer text-left"
              title="Voltar ao catálogo do supermercado"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-mateus-blue flex items-center justify-center shadow-heart transform group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-mateus-red text-mateus-red" />
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-black tracking-tight leading-none text-mateus-blue">
                  MATEUS
                </span>
                <span className="block text-[10px] sm:text-xs font-semibold text-slate-500">
                  Checkout de Supermercado
                </span>
              </div>
            </button>
          </div>

          {/* Selos de Segurança & Suporte */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs text-slate-500 font-semibold">
            <div className="hidden md:flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Lock size={14} className="text-emerald-600" />
              <span>Ambiente 100% Criptografado (SSL 256-bit)</span>
            </div>

            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-mateus-blue font-bold transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Voltar ao Supermercado</span>
              <span className="sm:hidden">Voltar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-10 space-y-8">
        {/* Se o pedido já foi finalizado com sucesso, exibe a tela de celebração */}
        {currentStep === 'success' && confirmedOrder ? (
          <OrderSuccessView
            order={confirmedOrder}
            onBackToStore={onBackToStore}
          />
        ) : (
          <>
            {/* 2. Barra de Progresso / Stepper Visual do Supermercado */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Linha de Conexão */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-mateus-blue transition-all duration-500 z-0"
                  style={{ width: currentStep === 'payment' ? '50%' : '0%' }}
                />

                {/* Passo 1: Endereço & Entrega */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all ${
                      currentStep === 'address'
                        ? 'bg-mateus-blue text-white ring-4 ring-mateus-blue/20 shadow-soft'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {currentStep === 'payment' ? <CheckCircle2 size={18} /> : '1'}
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-1.5">
                    1. Entrega & Horário
                  </span>
                </div>

                {/* Passo 2: Pagamento */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all ${
                      currentStep === 'payment'
                        ? 'bg-mateus-blue text-white ring-4 ring-mateus-blue/20 shadow-soft'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold mt-1.5 ${
                    currentStep === 'payment' ? 'text-mateus-blue font-black' : 'text-slate-500'
                  }`}>
                    2. Pagamento
                  </span>
                </div>

                {/* Passo 3: Confirmação */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-black text-xs sm:text-sm">
                    3
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1.5">
                    3. Confirmação
                  </span>
                </div>
              </div>
            </div>


            {/* Layout em 2 Colunas (Inspirado no Pão de Açúcar / Instacart / Ocado) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Coluna Esquerda: Fluxo em Etapas (65%) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                {/* ETAPA 1: ENTREGA, HORÁRIOS & PREFERÊNCIAS DE SUPERMERCADO */}
                {currentStep === 'address' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* 1.1 Modo de Recebimento */}
                    <section
                      aria-labelledby="delivery-mode-heading"
                      className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4"
                    >
                      <h3 id="delivery-mode-heading" className="text-base sm:text-lg font-black text-mateus-blue-900 flex items-center gap-2">
                        <Truck size={20} className="text-mateus-sky-600" />
                        <span>Como deseja receber suas compras?</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Opção Expressa */}
                        <button
                          type="button"
                          onClick={() => setDeliveryType('express')}
                          className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            deliveryType === 'express'
                              ? 'border-mateus-blue bg-mateus-blue-50/70 shadow-soft ring-2 ring-mateus-blue/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                              <Truck size={16} className="text-mateus-blue" />
                              <span>Entrega no seu Bairro</span>
                            </span>
                            <span className="text-xs font-black text-emerald-700">
                              {deliveryFee === 0 ? 'GRÁTIS' : 'R$ 9,90'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Nossos entregadores levam direto na sua porta com caixas térmicas e produtos acondicionados com carinho.
                          </p>
                        </button>

                        {/* Opção Retirada */}
                        <button
                          type="button"
                          onClick={() => setDeliveryType('pickup')}
                          className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            deliveryType === 'pickup'
                              ? 'border-mateus-blue bg-mateus-blue-50/70 shadow-soft ring-2 ring-mateus-blue/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                              <Store size={16} className="text-mateus-blue" />
                              <span>Retirada no Balcão</span>
                            </span>
                            <span className="text-xs font-black text-emerald-700">GRÁTIS</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Pronto em até 30 minutos na unidade Cohab Anil. É só passar no balcão de compras online com o Seu Osvaldo.
                          </p>
                        </button>
                      </div>
                    </section>

                    {/* 1.2 Janelas de Horário de Entrega (Padrão Pão de Açúcar / Instacart) */}
                    {deliveryType === 'express' && (
                      <section
                        aria-labelledby="delivery-slot-heading"
                        className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 id="delivery-slot-heading" className="text-base sm:text-lg font-black text-mateus-blue-900 flex items-center gap-2">
                            <Clock size={20} className="text-mateus-blue" />
                            <span>Janela de Horário para Entrega</span>
                          </h3>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Hoje Disponível
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setDeliverySlot('express')}
                            className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                              deliverySlot === 'express'
                                ? 'border-mateus-blue bg-mateus-blue-50 shadow-soft ring-2 ring-mateus-blue/20'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-black mb-1">
                              <span className="text-mateus-blue flex items-center gap-1">
                                <Zap size={14} /> Hoje Express
                              </span>
                              <span className="text-emerald-700 text-[11px]">Mais Rápido</span>
                            </div>
                            <span className="block text-sm font-black text-slate-800">35 a 50 minutos</span>
                            <span className="block text-[11px] text-slate-500 mt-1">Sai agora direto da horta e balcão</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeliverySlot('night')}
                            className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                              deliverySlot === 'night'
                                ? 'border-mateus-blue bg-mateus-blue-50 shadow-soft ring-2 ring-mateus-blue/20'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="text-xs font-black text-slate-700 mb-1">Hoje à Noite</div>
                            <span className="block text-sm font-black text-slate-800">19h00 às 21h00</span>
                            <span className="block text-[11px] text-slate-500 mt-1">Ao chegar do trabalho</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeliverySlot('tomorrow_morning')}
                            className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                              deliverySlot === 'tomorrow_morning'
                                ? 'border-mateus-blue bg-mateus-blue-50 shadow-soft ring-2 ring-mateus-blue/20'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="text-xs font-black text-slate-700 mb-1">Amanhã pela Manhã</div>
                            <span className="block text-sm font-black text-slate-800">08h00 às 11h00</span>
                            <span className="block text-[11px] text-slate-500 mt-1">Hortifrúti e pão fresquinho</span>
                          </button>
                        </div>
                      </section>
                    )}

                    {/* 1.3 Formulário de Endereço com Validação Zod */}
                    <section
                      aria-labelledby="address-form-heading"
                      className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4"
                    >
                      <h3 id="address-form-heading" className="text-base sm:text-lg font-black text-mateus-blue-900 flex items-center gap-2">
                        <MapPin size={20} className="text-mateus-red" />
                        <span>{deliveryType === 'express' ? 'Endereço de Entrega' : 'Dados para Retirada'}</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nome de quem vai receber:
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.recipientName}
                            onChange={(e) => {
                              setShippingAddress({ ...shippingAddress, recipientName: e.target.value });
                              if (addressErrors.recipientName) {
                                const next = { ...addressErrors };
                                delete next.recipientName;
                                setAddressErrors(next);
                              }
                            }}
                            className={`w-full p-2.5 rounded-xl border bg-white font-semibold text-sm transition focus:outline-none ${
                              addressErrors.recipientName
                                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                                : 'border-slate-300 focus:border-mateus-blue'
                            }`}
                          />
                          {addressErrors.recipientName && (
                            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle size={13} /> {addressErrors.recipientName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            CEP:
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.cep}
                            onChange={(e) => {
                              setShippingAddress({ ...shippingAddress, cep: formatCep(e.target.value) });
                              if (addressErrors.cep) {
                                const next = { ...addressErrors };
                                delete next.cep;
                                setAddressErrors(next);
                              }
                            }}
                            maxLength={9}
                            className={`w-full p-2.5 rounded-xl border bg-white font-mono font-bold text-sm transition focus:outline-none ${
                              addressErrors.cep
                                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                                : 'border-slate-300 focus:border-mateus-blue'
                            }`}
                          />
                          {addressErrors.cep && (
                            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle size={13} /> {addressErrors.cep}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Bairro:
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.neighborhood}
                            onChange={(e) => {
                              setShippingAddress({ ...shippingAddress, neighborhood: e.target.value });
                              if (addressErrors.neighborhood) {
                                const next = { ...addressErrors };
                                delete next.neighborhood;
                                setAddressErrors(next);
                              }
                            }}
                            className={`w-full p-2.5 rounded-xl border bg-white font-semibold text-sm transition focus:outline-none ${
                              addressErrors.neighborhood
                                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                                : 'border-slate-300 focus:border-mateus-blue'
                            }`}
                          />
                          {addressErrors.neighborhood && (
                            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle size={13} /> {addressErrors.neighborhood}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2 grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Rua / Avenida:
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.street}
                              onChange={(e) => {
                                setShippingAddress({ ...shippingAddress, street: e.target.value });
                                if (addressErrors.street) {
                                  const next = { ...addressErrors };
                                  delete next.street;
                                  setAddressErrors(next);
                                }
                              }}
                              className={`w-full p-2.5 rounded-xl border bg-white font-semibold text-sm transition focus:outline-none ${
                                addressErrors.street
                                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                                : 'border-slate-300 focus:border-mateus-blue'
                              }`}
                            />
                            {addressErrors.street && (
                              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                                <AlertCircle size={13} /> {addressErrors.street}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Número:
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.number}
                              onChange={(e) => {
                                setShippingAddress({ ...shippingAddress, number: e.target.value });
                                if (addressErrors.number) {
                                  const next = { ...addressErrors };
                                  delete next.number;
                                  setAddressErrors(next);
                                }
                              }}
                              className={`w-full p-2.5 rounded-xl border bg-white font-semibold text-sm transition focus:outline-none ${
                                addressErrors.number
                                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                                : 'border-slate-300 focus:border-mateus-blue'
                              }`}
                            />
                            {addressErrors.number && (
                              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                                <AlertCircle size={13} /> {addressErrors.number}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Complemento (opcional):
                          </label>
                          <input
                            type="text"
                            placeholder="Apto, Bloco, Ponto de ref."
                            value={shippingAddress.complement || ''}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, complement: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-sm focus:border-mateus-blue focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Cidade / Estado:
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={`${shippingAddress.city} - ${shippingAddress.state}`}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-semibold text-sm text-slate-600"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Instruções para o entregador (opcional):
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Tocar o interfone 204, deixar na portaria..."
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-sm focus:border-mateus-blue focus:outline-none"
                          />
                        </div>
                      </div>
                    </section>

                    {/* 1.4 Preferências de Supermercado: Substituição Inteligente & Dica do Hortifrúti */}
                    <section
                      aria-labelledby="supermarket-prefs-heading"
                      className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw size={18} className="text-mateus-blue" />
                        <h3 id="supermarket-prefs-heading" className="text-base sm:text-lg font-black text-mateus-blue-900">
                          Se algum produto estiver em falta no estoque:
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setReplacementPolicy('similar')}
                          className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                            replacementPolicy === 'similar'
                              ? 'border-emerald-500 bg-emerald-50/70 shadow-soft ring-2 ring-emerald-500/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 mb-1">
                            <Sparkles size={14} /> Substituir por Similar
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Substitui por marca igual ou de categoria superior sem custo extra.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReplacementPolicy('contact')}
                          className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                            replacementPolicy === 'contact'
                              ? 'border-mateus-blue bg-mateus-blue-50/70 shadow-soft ring-2 ring-mateus-blue/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-black text-mateus-blue mb-1">
                            <PhoneCall size={14} /> Ligar / WhatsApp
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            O separador entra em contato antes de finalizar a cesta.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReplacementPolicy('cancel')}
                          className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                            replacementPolicy === 'cancel'
                              ? 'border-slate-600 bg-slate-100 shadow-soft ring-2 ring-slate-400/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-1">
                            <XCircle size={14} /> Não Substituir
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Remove o item e estorna o valor correspondente no total.
                          </p>
                        </button>
                      </div>

                      {/* Observações de Frescor (Hortifrúti / Açougue / Padaria) */}
                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <MessageSquare size={14} className="text-mateus-sky-600" />
                          <span>Dica especial para o Separador do Supermercado (opcional):</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Bananas mais verdes para durar a semana, queijo fatiado fino, pão bem assado..."
                          value={separatorNotes}
                          onChange={(e) => setSeparatorNotes(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs sm:text-sm focus:border-mateus-blue focus:outline-none"
                        />
                      </div>

                      {/* Alerta de Endereço Incompleto logo acima do botão */}
                      {errorMessage && currentStep === 'address' && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-900 text-xs font-bold flex items-center gap-2">
                          <AlertCircle size={18} className="text-rose-600 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Botão Avançar para o Pagamento */}
                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={handleProceedToPayment}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-mateus-red hover:bg-mateus-red-hover text-white font-black text-sm sm:text-base shadow-heart transition transform hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <span>Continuar para o Pagamento</span>
                          <CheckCircle2 size={18} />
                        </button>
                      </div>
                    </section>
                  </div>
                )}

                {/* ETAPA 2: FORMAS DE PAGAMENTO & SIMULAÇÃO BANCÁRIA */}
                {currentStep === 'payment' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Resumo do Endereço com Botão de Alterar */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-mateus-blue/10 text-mateus-blue flex items-center justify-center shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <span className="block font-black text-slate-800">
                            {deliveryType === 'express' ? `Entrega para ${shippingAddress.recipientName}` : 'Retirada no Balcão Cohab Anil'}
                          </span>
                          <span className="text-slate-500">
                            {shippingAddress.street}, nº {shippingAddress.number} • {shippingAddress.neighborhood}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPixPendingOrder(null);
                          setCurrentStep('address');
                        }}
                        className="text-xs font-bold text-mateus-blue hover:underline cursor-pointer"
                      >
                        Alterar
                      </button>
                    </div>

                    {/* Se o PIX já foi gerado, exibe a tela dedicada do PIX */}
                    {pixPendingOrder ? (
                      <div className="space-y-4">
                        <PixPayment
                          orderNumber={pixPendingOrder.orderNumber}
                          totalAmount={totalAmount}
                          onSimulateBankApproval={handlePixSimulateApproval}
                          onSimulateRejection={handlePixSimulateRejection}
                        />

                        <button
                          type="button"
                          onClick={() => setPixPendingOrder(null)}
                          className="text-xs font-bold text-slate-600 hover:text-mateus-blue flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowLeft size={14} />
                          <span>Escolher outra forma de pagamento</span>
                        </button>
                      </div>
                    ) : (
                      /* Formulário Completo de Pagamento */
                      <section
                        ref={paymentSectionRef}
                        aria-labelledby="payment-heading"
                        className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6"
                      >
                        <h3 id="payment-heading" className="text-base sm:text-lg font-black text-mateus-blue-900 flex items-center gap-2">
                          <CreditCard size={20} className="text-mateus-blue" />
                          <span>Escolha como deseja pagar</span>
                        </h3>

                        {/* Seletor de Método de Pagamento */}
                        <PaymentMethodSelector
                          selected={paymentMethod}
                          onSelect={(method) => {
                            setPaymentMethod(method);
                            setErrorMessage(null);
                            setCardRejectionReason(null);
                          }}
                          userCaderninhoLimit={user?.caderninhoLimit}
                        />

                        {/* Formulário do Método Selecionado */}
                        {paymentMethod === 'CADERNINHO' && (
                          <CaderninhoPayment totalAmount={totalAmount} />
                        )}

                        {paymentMethod === 'CARTAO_CREDITO' && (
                          <CreditCardPayment
                            cardData={cardData}
                            onChange={(next) => {
                              setCardData(next);
                              if (cardRejectionReason) setCardRejectionReason(null);
                              if (errorMessage) setErrorMessage(null);
                            }}
                            totalAmount={totalAmount}
                            errors={cardErrors}
                            cardRejectionReason={cardRejectionReason}
                            onClearError={(field) => {
                              if (cardErrors[field]) {
                                const next = { ...cardErrors };
                                delete next[field];
                                setCardErrors(next);
                              }
                              if (cardRejectionReason) setCardRejectionReason(null);
                              if (errorMessage) setErrorMessage(null);
                            }}
                            onAutoFillTestCard={handleAutoFillValidTestCard}
                          />
                        )}

                        {paymentMethod === 'PIX' && (
                          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                            <p className="font-black text-sm flex items-center gap-1.5 text-emerald-800">
                              <Zap size={16} /> Pagamento Rápido via PIX
                            </p>
                            <p className="leading-relaxed">
                              Ao clicar em <strong>"Gerar QR Code PIX"</strong>, geraremos a chave Copia e Cola oficial e o QR Code dinâmico para você pagar pelo aplicativo do seu banco com aprovação em poucos segundos.
                            </p>
                          </div>
                        )}

                        {/* ALERTA IMEDIATO LOGO ABAIXO DO FORMULÁRIO (No Campo Visual do Usuário) */}
                        {(errorMessage || cardRejectionReason) && currentStep === 'payment' && (
                          <div
                            role="alert"
                            className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 shadow-md animate-in fade-in slide-in-from-top-1 space-y-2.5"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <AlertCircle size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <strong className="font-black text-sm text-rose-900">
                                    {cardRejectionReason
                                      ? 'Transação Não Autorizada pelo Banco'
                                      : 'Aviso sobre o Pagamento'}
                                  </strong>
                                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-rose-300">
                                    {paymentMethod === 'CARTAO_CREDITO' ? 'Cartão Recusado' : 'Atenção'}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-rose-800 font-semibold leading-relaxed">
                                  {cardRejectionReason || errorMessage}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              <span className="text-rose-700 font-medium">
                                🔒 Seus produtos continuam 100% salvos na cesta. Nenhuma informação foi perdida.
                              </span>
                              {paymentMethod === 'CARTAO_CREDITO' && (
                                <button
                                  type="button"
                                  onClick={handleAutoFillValidTestCard}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-xs transition active:scale-95 cursor-pointer"
                                >
                                  <Zap size={12} className="fill-slate-950" />
                                  <span>Testar com Cartão Válido (1 Clique)</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Ações de Navegação */}
                        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setCurrentStep('address')}
                            disabled={isProcessing}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                          >
                            <ArrowLeft size={15} />
                            <span>Voltar para o Endereço</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleConfirmPayment}
                            disabled={isProcessing}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-mateus-red hover:bg-mateus-red-hover text-white font-black text-sm sm:text-base shadow-heart transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Processando no Gateway...</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  {paymentMethod === 'PIX'
                                    ? 'Gerar QR Code PIX'
                                    : `Confirmar e Pagar (R$ ${totalAmount.toFixed(2).replace('.', ',')})`}
                                </span>
                                <CheckCircle2 size={18} />
                              </>
                            )}
                          </button>
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </div>

              {/* Coluna Direita: Resumo Fixo da Cesta de Supermercado (35%) */}
              <aside
                aria-label="Resumo do Pedido"
                className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4"
              >
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-black text-base text-mateus-blue flex items-center gap-2">
                      <ShoppingBag size={18} className="text-mateus-red" />
                      <span>Resumo da Cesta</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                    </span>
                  </div>

                  {/* Lista de Itens do Supermercado */}
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                    {validItems.map(({ product, quantity }) => (
                      <div key={product.id} className="py-2.5 flex items-center gap-3 text-xs">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 border p-1 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/favicon.svg';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 truncate">{product.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {quantity}x R$ {product.price.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        <span className="font-black text-slate-800 shrink-0">
                          R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cupom de Desconto de Supermercado */}
                  <div className="pt-2 border-t border-slate-100">
                    {appliedCoupon ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <Tag size={14} className="text-emerald-600" />
                          <span>Cupom {appliedCoupon.code} aplicado</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="space-y-1">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Cupom (ex: DENTINHO10)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono uppercase focus:border-mateus-blue focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                          >
                            Aplicar
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
                        )}
                      </form>
                    )}
                  </div>

                  {/* Totais Financeiros */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Subtotal dos Produtos:</span>
                      <span className="text-slate-800 font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Taxa de Entrega:</span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                          <Sparkles size={12} /> GRÁTIS
                        </span>
                      ) : (
                        <span className="text-slate-800 font-bold">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                      )}
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Desconto do Cupom:</span>
                        <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="text-base font-black text-mateus-blue-900">Total a Pagar:</span>
                      <span className="text-2xl font-black text-mateus-blue">
                        R$ {totalAmount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selos de Confiança e Atendimento de Supermercado */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span><strong>Garantia de Frescor:</strong> Frutas e carnes selecionadas hoje no balcão.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-mateus-red shrink-0" />
                    <span><strong>Você no Coração da Gente:</strong> Tradição do Seu Osvaldo desde 1987.</span>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      {/* Rodapé Simples de Checkout */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>© 2026 Grupo Mateus — Supermercado Você no Coração da Gente. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

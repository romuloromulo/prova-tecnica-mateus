import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/orderService';
import type { PaymentMethod, ShippingAddress, CreditCardData, Order } from '@/types/order';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CaderninhoPayment } from './CaderninhoPayment';
import { PixPayment } from './PixPayment';
import { CreditCardPayment } from './CreditCardPayment';
import { OrderSuccessModal } from './OrderSuccessModal';
import { formatCep } from '@/utils/paymentUtils';
import {
  X,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Truck,
  Heart
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, getSubtotal, getTotalItems, clearCart } = useCartStore();
  const { user, debitCaderninhoLimit } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CADERNINHO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [createdPixOrder, setCreatedPixOrder] = useState<Order | null>(null);

  // Endereço de entrega com padrão acolhedor (São Luís - MA / Terra do Grupo Mateus)
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

  // Dados do Cartão de Crédito
  const [cardData, setCardData] = useState<CreditCardData>({
    number: '4000 0000 0000 0001',
    holderName: (user?.name || 'DONA MARTA DE SOUSA').toUpperCase(),
    expiry: '12/28',
    cvv: '123',
    installments: 1,
  });

  // Atualiza nome do destinatário se o usuário logar
  useEffect(() => {
    if (user?.name) {
      setShippingAddress((prev) => ({ ...prev, recipientName: user.name }));
    }
  }, [user]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setErrorMessage(null);
      setCreatedPixOrder(null);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isProcessing]);

  if (!isOpen) return null;

  const validItems = items.filter(
    (i) => i && i.product && i.product.id && typeof i.product.price === 'number'
  );
  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= 120 || subtotal === 0 ? 0 : 9.9;
  const totalAmount = subtotal + deliveryFee;

  const handleConfirmOrder = async () => {
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

    // Validação Cartão
    if (paymentMethod === 'CARTAO_CREDITO') {
      const cleanNum = cardData.number.replace(/\D/g, '');
      if (cleanNum.length < 13) {
        setErrorMessage('Por favor, digite um número de cartão de crédito válido.');
        return;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        setErrorMessage('Por favor, informe a data de validade no formato MM/AA.');
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        setErrorMessage('Por favor, informe o código de segurança (CVV).');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simula pequeno delay de rede para a transição de estado visual ficar perceptível
      await new Promise((resolve) => setTimeout(resolve, 800));

      const order = await orderService.createOrder({
        items: validItems,
        shippingAddress,
        paymentMethod,
        cardData: paymentMethod === 'CARTAO_CREDITO' ? cardData : undefined,
      });

      if (paymentMethod === 'PIX') {
        // No PIX, exibimos o QR Code para pagamento
        setCreatedPixOrder(order);
        setIsProcessing(false);
        return;
      }

      if (order.status === 'APPROVED') {
        // Se pagou com Caderninho, debita o saldo na store
        if (paymentMethod === 'CADERNINHO') {
          debitCaderninhoLimit(totalAmount);
        }
        clearCart();
        setCompletedOrder(order);
      } else {
        setErrorMessage(
          order.failureReason || 'Não foi possível autorizar o pagamento. Tente novamente ou use outro método.'
        );
      }
    } catch {
      setErrorMessage('Erro de comunicação ao processar o pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Callback do simulador PIX para aprovação
  const handlePixSimulateApproval = async () => {
    if (!createdPixOrder) return;
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const updated = await orderService.simulatePayment({
      orderId: createdPixOrder.id,
      simulateStatus: 'APPROVED',
    });

    clearCart();
    setCreatedPixOrder(null);
    setCompletedOrder(updated);
    setIsProcessing(false);
  };

  // Callback do simulador PIX para recusa / timeout
  const handlePixSimulateRejection = async () => {
    if (!createdPixOrder) return;
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    await orderService.simulatePayment({
      orderId: createdPixOrder.id,
      simulateStatus: 'REJECTED',
      rejectionReason: 'Pagamento PIX expirado pelo tempo limite.',
    });

    setCreatedPixOrder(null);
    setErrorMessage('O pagamento PIX expirou. Por favor, tente novamente.');
    setIsProcessing(false);
  };

  const handleFinishSuccess = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <>
      {/* Modal de Sucesso Comemorativo quando o pedido for Aprovado */}
      {completedOrder && (
        <OrderSuccessModal order={completedOrder} onClose={handleFinishSuccess} />
      )}

      {/* Modal Principal de Checkout */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
      >
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
          {/* Cabeçalho do Checkout */}
          <div className="px-5 py-4 sm:px-6 bg-mateus-blue text-white flex items-center justify-between shadow-soft shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-heart">
                <Heart size={18} className="fill-mateus-red text-mateus-red" />
              </div>
              <div>
                <h3 id="checkout-title" className="text-base sm:text-lg font-black leading-tight">
                  Finalizar Pedido • Grupo Mateus
                </h3>
                <p className="text-[11px] text-mateus-sky-100 font-medium">
                  Tradição do balcão de 1987 direto para sua casa
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              aria-label="Fechar checkout"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mensagem de Erro / Recusa */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border-b border-rose-200 text-rose-900 flex items-start gap-2.5 text-xs animate-in fade-in">
              <AlertCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Aviso sobre o pagamento:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Conteúdo com Rolagem */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Se PIX já foi gerado, foca na tela do PIX */}
            {createdPixOrder ? (
              <PixPayment
                orderNumber={createdPixOrder.orderNumber}
                totalAmount={totalAmount}
                onSimulateBankApproval={handlePixSimulateApproval}
                onSimulateRejection={handlePixSimulateRejection}
              />
            ) : (
              <>
                {/* 1. Endereço de Entrega */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black uppercase text-mateus-blue">
                      <MapPin size={15} className="text-mateus-red" />
                      <span>Endereço de Entrega</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Entrega expressa de bairro
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Destinatário:</label>
                      <input
                        type="text"
                        value={shippingAddress.recipientName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, recipientName: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">CEP:</label>
                      <input
                        type="text"
                        value={shippingAddress.cep}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, cep: formatCep(e.target.value) })}
                        maxLength={9}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white font-mono font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Rua / Logradouro:</label>
                        <input
                          type="text"
                          value={shippingAddress.street}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                          className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Número:</label>
                        <input
                          type="text"
                          value={shippingAddress.number}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, number: e.target.value })}
                          className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Bairro:</label>
                      <input
                        type="text"
                        value={shippingAddress.neighborhood}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, neighborhood: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Cidade / UF:</label>
                      <input
                        type="text"
                        readOnly
                        value={`${shippingAddress.city} - ${shippingAddress.state}`}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Resumo Compacto dos Itens */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-mateus-blue" />
                      <span>Itens do Pedido ({getTotalItems()} produtos)</span>
                    </span>
                    <span>Subtotal: R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="max-h-24 overflow-y-auto divide-y divide-slate-100 pr-1">
                    {validItems.map(({ product, quantity }) => (
                      <div key={product.id} className="py-1.5 flex items-center justify-between text-xs">
                        <span className="truncate max-w-[240px] text-slate-800 font-medium">
                          {quantity}x {product.name}
                        </span>
                        <span className="font-bold text-mateus-blue shrink-0">
                          R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Seletor de Método de Pagamento */}
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                  userCaderninhoLimit={user?.caderninhoLimit}
                />

                {/* 4. Formulário do Método Selecionado */}
                {paymentMethod === 'CADERNINHO' && (
                  <CaderninhoPayment totalAmount={totalAmount} />
                )}

                {paymentMethod === 'CARTAO_CREDITO' && (
                  <CreditCardPayment
                    cardData={cardData}
                    onChange={setCardData}
                    totalAmount={totalAmount}
                  />
                )}

                {paymentMethod === 'PIX' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-black">⚡ Como pagar com PIX:</p>
                    <p className="text-[11px] leading-relaxed">
                      Ao clicar no botão abaixo, geraremos um QR Code exclusivo e o código Copia e Cola para você pagar diretamente no app do seu banco com compensação instantânea!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Rodapé do Checkout com Resumo de Valores e Botão CTA */}
          {!createdPixOrder && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Entrega expressa:</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <Truck size={13} /> Frete Grátis
                  </span>
                ) : (
                  <span className="font-bold">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
                <span className="text-sm font-black text-mateus-blue-900">Total a Pagar:</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-mateus-blue">
                    R$ {totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-mateus-red hover:bg-mateus-red-hover text-white font-black text-sm sm:text-base shadow-heart transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processando e Validando Pedido...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'PIX'
                        ? 'Gerar PIX para Pagamento'
                        : `Confirmar Pedido (R$ ${totalAmount.toFixed(2).replace('.', ',')})`}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold pt-0.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Transação segura com criptografia e tradição do Grupo Mateus</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

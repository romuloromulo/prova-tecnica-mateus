import React from 'react';
import type { Order } from '@/types/order';
import { CheckCircle2, Clock, MapPin, Printer, ArrowRight, BookOpen, Zap, CreditCard } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="modal-panel relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        {/* Banner de Celebração com o Dentinho */}
        <div className="p-6 bg-gradient-to-r from-mateus-blue-900 via-mateus-blue to-mateus-blue-800 text-white text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            {/* Mascote Dentinho em pose de comemoração */}
            <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-dentinho mb-3 flex items-center justify-center animate-bounce [animation-duration:1.5s]">
              <img
                src="/mascote/dentinho-sucesso.svg"
                alt="Mascote Dentinho comemorando a aprovação do pedido"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-xs mb-2">
              <CheckCircle2 size={15} />
              <span>Pedido Aprovado com Sucesso!</span>
            </div>

            <h3 id="success-modal-title" className="text-xl sm:text-2xl font-black">
              Obrigado pela preferência, vizinho!
            </h3>
            <p className="text-xs text-mateus-sky-100 mt-1 max-w-sm">
              O Seu Osvaldo já começou a embalar seus produtos com todo o carinho e qualidade de sempre.
            </p>
          </div>
        </div>

        {/* Detalhes do Pedido e Protocolo */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Protocolo do Pedido</span>
              <span className="font-mono font-black text-sm text-mateus-blue">
                #{order.orderNumber}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Total Pago</span>
              <span className="font-black text-sm text-slate-900">
                R$ {order.totalAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Forma de Pagamento Utilizada */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
            <span className="block text-slate-400 font-bold uppercase text-[10px]">Forma de Pagamento</span>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              {order.paymentMethod === 'CADERNINHO' && (
                <>
                  <BookOpen size={16} className="text-mateus-blue" />
                  <span>Caderninho Digital do Seu Osvaldo (Anotado para o dia 10)</span>
                </>
              )}
              {order.paymentMethod === 'PIX' && (
                <>
                  <Zap size={16} className="text-emerald-600" />
                  <span>PIX Instantâneo (Compensado)</span>
                </>
              )}
              {order.paymentMethod === 'CARTAO_CREDITO' && (
                <>
                  <CreditCard size={16} className="text-mateus-red" />
                  <span>Cartão de Crédito final {order.cardDetails?.lastFourDigits || '0001'} ({order.cardDetails?.installments || 1}x)</span>
                </>
              )}
            </div>
          </div>

          {/* Previsão de Entrega & Endereço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Clock size={14} className="text-mateus-blue" />
                <span>Previsão de Entrega</span>
              </div>
              <p className="text-slate-600 font-semibold text-[11px]">
                35 a 50 minutos (Entrega expressa de bairro)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <MapPin size={14} className="text-mateus-red" />
                <span>Destinatário</span>
              </div>
              <p className="text-slate-600 font-semibold text-[11px] truncate">
                {order.shippingAddress.recipientName} • {order.shippingAddress.neighborhood}
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
          >
            <Printer size={15} />
            <span>Imprimir Recibo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white font-black text-xs sm:text-sm shadow-heart transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Continuar Comprando</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { Order } from '@/types/order';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Printer,
  ShoppingBag,
  BookOpen,
  Zap,
  CreditCard,
  Truck,
  PackageCheck
} from 'lucide-react';

interface OrderSuccessViewProps {
  order: Order;
  onBackToStore: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onBackToStore,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Banner Principal de Celebração com o Mascote Dentinho */}
      <section
        aria-label="Confirmação do Pedido"
        className="rounded-3xl bg-gradient-to-r from-mateus-blue-900 via-mateus-blue to-mateus-blue-800 text-white p-6 sm:p-10 shadow-soft text-center relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
          {/* Mascote Dentinho comemorando */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/10 backdrop-blur-md p-3 border border-white/20 shadow-dentinho mb-4 flex items-center justify-center animate-bounce [animation-duration:1.5s]">
            <img
              src="/mascote/dentinho-sucesso.svg"
              alt="Mascote Dentinho comemorando o pedido"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-xs mb-3">
            <CheckCircle2 size={16} />
            <span>Pagamento Aprovado com Sucesso!</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Tudo certo, vizinho! Pedido confirmado.
          </h2>

          <p className="text-mateus-sky-100 text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
            O Seu Osvaldo já recebeu sua lista e nossos operadores estão separando os itens mais fresquinhos no balcão para você.
          </p>

          <div className="mt-4 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-mono font-bold tracking-wider">
            Protocolo: <span className="text-amber-300">#{order.orderNumber}</span>
          </div>
        </div>
      </section>

      {/* Linha do Tempo Visual do Supermercado (Order Tracking) */}
      <section
        aria-label="Acompanhamento do Pedido"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5"
      >
        <h3 className="text-base sm:text-lg font-black text-mateus-blue-900 flex items-center gap-2">
          <Clock size={18} className="text-mateus-sky-600" />
          <span>Status da Entrega Expressa</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {/* Etapa 1: Confirmado */}
          <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="block text-xs font-black text-emerald-900">1. Confirmado</span>
              <span className="text-[11px] text-emerald-700">Pagamento recebido</span>
            </div>
          </div>

          {/* Etapa 2: Em Separação */}
          <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center p-3 rounded-2xl bg-blue-50 border border-blue-200 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-mateus-blue text-white flex items-center justify-center shrink-0 shadow-xs">
              <PackageCheck size={20} />
            </div>
            <div>
              <span className="block text-xs font-black text-mateus-blue-900">2. Em Separação</span>
              <span className="text-[11px] text-mateus-blue-700">Na horta e padaria</span>
            </div>
          </div>

          {/* Etapa 3: A Caminho */}
          <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center p-3 rounded-2xl bg-slate-50 border border-slate-200 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-slate-300 text-slate-700 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700">3. A Caminho</span>
              <span className="text-[11px] text-slate-500">Com o entregador</span>
            </div>
          </div>

          {/* Etapa 4: Entregue */}
          <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center p-3 rounded-2xl bg-slate-50 border border-slate-200 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-slate-300 text-slate-700 flex items-center justify-center shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700">4. Entregue</span>
              <span className="text-[11px] text-slate-500">Na sua porta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Detalhes de Endereço, Pagamento e Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card: Endereço & Previsão */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-mateus-blue font-black text-sm">
            <MapPin size={18} className="text-mateus-red" />
            <span>Destino da Entrega</span>
          </div>

          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-extrabold text-sm text-slate-900">{order.shippingAddress.recipientName}</p>
            <p>{order.shippingAddress.street}, nº {order.shippingAddress.number}</p>
            {order.shippingAddress.complement && <p className="text-slate-500">Complemento: {order.shippingAddress.complement}</p>}
            <p>{order.shippingAddress.neighborhood} • {order.shippingAddress.city} - {order.shippingAddress.state}</p>
            <p className="font-mono text-slate-500">CEP: {order.shippingAddress.cep}</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <Clock size={15} className="text-mateus-sky-600" />
            <span>Previsão de entrega: <strong>35 a 50 minutos</strong></span>
          </div>
        </section>

        {/* Card: Resumo do Pagamento */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-mateus-blue font-black text-sm">
            <CreditCard size={18} className="text-mateus-blue" />
            <span>Pagamento Realizado</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                {order.paymentMethod === 'CADERNINHO' && <BookOpen size={16} className="text-mateus-blue" />}
                {order.paymentMethod === 'PIX' && <Zap size={16} className="text-emerald-600" />}
                {order.paymentMethod === 'CARTAO_CREDITO' && <CreditCard size={16} className="text-mateus-red" />}
                <span>
                  {order.paymentMethod === 'CADERNINHO' && 'Caderninho Digital do Seu Osvaldo'}
                  {order.paymentMethod === 'PIX' && 'PIX Instantâneo'}
                  {order.paymentMethod === 'CARTAO_CREDITO' && `Cartão final ${order.cardDetails?.lastFourDigits || '0001'} (${order.cardDetails?.installments || 1}x)`}
                </span>
              </span>
              <span className="text-emerald-700 font-extrabold">Aprovado</span>
            </div>

            <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
              <span>Subtotal ({order.items.length} itens):</span>
              <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Taxa de Entrega:</span>
              <span>{order.deliveryFee === 0 ? 'GRÁTIS' : `R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}`}</span>
            </div>

            <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
              <span>Total Pago:</span>
              <span className="text-mateus-blue">R$ {order.totalAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Botões de Ação Final */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition shadow-xs cursor-pointer"
        >
          <Printer size={16} />
          <span>Imprimir Recibo do Pedido</span>
        </button>

        <button
          type="button"
          onClick={onBackToStore}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-mateus-red hover:bg-mateus-red-hover text-white font-black text-sm sm:text-base shadow-heart transition transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ShoppingBag size={18} />
          <span>Voltar ao Supermercado para Novas Compras</span>
        </button>
      </div>
    </div>
  );
};

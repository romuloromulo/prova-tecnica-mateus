import React from 'react';
import { ArrowRight, Truck, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  userCaderninhoLimit?: number;
  userName?: string | null;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 120.0;

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  totalItems,
  userCaderninhoLimit,
  userName,
  onCheckout,
  onContinueShopping,
  onClearCart,
}) => {
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const deliveryFee = isFreeShipping || subtotal === 0 ? 0 : 9.9;
  const total = subtotal + deliveryFee;

  const hasExceededCaderninho =
    userCaderninhoLimit !== undefined && total > userCaderninhoLimit;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      {/* Barra de Progresso de Frete Grátis */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-mateus-sky-50 to-blue-50 border border-mateus-sky-200/80">
        <div className="flex items-center justify-between text-xs font-bold text-mateus-blue-900 mb-2">
          <span className="flex items-center gap-1.5">
            <Truck size={15} className="text-mateus-sky-600" />
            <span>
              {isFreeShipping ? (
                <strong className="text-emerald-700">🎉 Frete Grátis Liberado!</strong>
              ) : (
                <>
                  Faltam <strong className="text-mateus-red">R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</strong> para Frete Grátis
                </>
              )}
            </span>
          </span>
          <span className="text-[11px] font-extrabold text-mateus-sky-700">{shippingProgress}%</span>
        </div>

        {/* Barra de Progresso Visual */}
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-mateus-sky-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      {/* Verificação do Caderninho Digital */}
      {userName && userCaderninhoLimit !== undefined && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 border ${
            hasExceededCaderninho
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          <BookOpen size={16} className={`shrink-0 mt-0.5 ${hasExceededCaderninho ? 'text-amber-600' : 'text-emerald-600'}`} />
          <div>
            <p className="leading-tight">
              <strong>Caderninho Digital:</strong> Limite de R$ {userCaderninhoLimit.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-[11px] mt-0.5 opacity-90">
              {hasExceededCaderninho
                ? 'Total excede o limite disponível do caderninho. Você poderá pagar a diferença com PIX ou Cartão.'
                : `Compra 100% coberta com aprovação imediata para ${userName}!`}
            </p>
          </div>
        </div>
      )}

      {/* Valores Financeiros */}
      <div className="space-y-1.5 text-xs sm:text-sm">
        <div className="flex justify-between text-slate-500 font-medium">
          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'}):</span>
          <span className="text-slate-800 font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>

        <div className="flex justify-between text-slate-500 font-medium">
          <span>Entrega no seu Bairro:</span>
          {deliveryFee === 0 ? (
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <Sparkles size={12} /> GRÁTIS
            </span>
          ) : (
            <span className="text-slate-800 font-bold">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-sm sm:text-base font-black text-mateus-blue-900">Total:</span>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-mateus-blue">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
            <span className="block text-[10px] text-slate-400 font-semibold">
              ou até 3x sem juros no Caderninho Digital
            </span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onCheckout}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-mateus-red hover:bg-mateus-red-hover text-white font-black text-sm sm:text-base shadow-heart transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Avançar para o Pagamento</span>
          <ArrowRight size={18} />
        </button>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={onContinueShopping}
            className="text-xs font-bold text-slate-600 hover:text-mateus-blue transition py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            ← Continuar comprando
          </button>

          <button
            type="button"
            onClick={onClearCart}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 transition py-1 px-2 rounded-lg hover:bg-rose-50 cursor-pointer"
          >
            Esvaziar cesta
          </button>
        </div>
      </div>

      {/* Selo de Segurança e Tradição */}
      <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Compra 100% segura com a tradição do Grupo Mateus</span>
      </div>
    </div>
  );
};

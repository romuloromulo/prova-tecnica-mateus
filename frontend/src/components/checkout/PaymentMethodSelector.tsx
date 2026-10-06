import React from 'react';
import type { PaymentMethod } from '@/types/order';
import { BookOpen, Zap, CreditCard, Sparkles } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  userCaderninhoLimit?: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onSelect,
  userCaderninhoLimit,
}) => {
  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-black uppercase tracking-wider text-mateus-blue-900">
        Escolha a Forma de Pagamento
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Opção 1: Caderninho Digital de 1987 */}
        <button
          type="button"
          onClick={() => onSelect('CADERNINHO')}
          className={`relative p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selected === 'CADERNINHO'
              ? 'border-mateus-blue bg-mateus-blue-50/70 shadow-soft ring-2 ring-mateus-blue/20'
              : 'border-slate-200 bg-white hover:border-mateus-sky-300 hover:bg-slate-50/50'
          }`}
        >
          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black shadow-xs flex items-center gap-0.5">
            <Sparkles size={11} /> Tradição 1987
          </span>

          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              selected === 'CADERNINHO' ? 'bg-mateus-blue text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <BookOpen size={16} />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
              Caderninho Digital
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            {userCaderninhoLimit !== undefined
              ? `Limite: R$ ${userCaderninhoLimit.toFixed(2).replace('.', ',')}`
              : 'Crédito de confiança Seu Osvaldo'}
          </p>
        </button>

        {/* Opção 2: PIX Instantâneo */}
        <button
          type="button"
          onClick={() => onSelect('PIX')}
          className={`relative p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selected === 'PIX'
              ? 'border-emerald-600 bg-emerald-50/70 shadow-soft ring-2 ring-emerald-600/20'
              : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/50'
          }`}
        >
          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs">
            Aprovação Instantânea
          </span>

          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              selected === 'PIX' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Zap size={16} />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
              PIX
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            QR Code dinâmico com chave copia e cola oficial
          </p>
        </button>

        {/* Opção 3: Cartão de Crédito */}
        <button
          type="button"
          onClick={() => onSelect('CARTAO_CREDITO')}
          className={`relative p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
            selected === 'CARTAO_CREDITO'
              ? 'border-mateus-red bg-rose-50/60 shadow-soft ring-2 ring-mateus-red/20'
              : 'border-slate-200 bg-white hover:border-mateus-red/40 hover:bg-slate-50/50'
          }`}
        >
          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-mateus-red text-white text-[10px] font-black shadow-xs">
            Até 3x Sem Juros
          </span>

          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              selected === 'CARTAO_CREDITO' ? 'bg-mateus-red text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <CreditCard size={16} />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
              Cartão de Crédito
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Visa, Mastercard, Elo e Hipercard
          </p>
        </button>
      </div>
    </div>
  );
};

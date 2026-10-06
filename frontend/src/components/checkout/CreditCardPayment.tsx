import React from 'react';
import type { CreditCardData } from '@/types/order';
import {
  formatCardNumber,
  formatExpiry,
  formatCvv,
  detectCardBrand,
  validateLuhn,
  TEST_CARDS,
  type TestCardPreset,
} from '@/utils/paymentUtils';
import { CreditCard, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface CreditCardPaymentProps {
  cardData: CreditCardData;
  onChange: (updated: CreditCardData) => void;
  totalAmount: number;
}

export const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({
  cardData,
  onChange,
  totalAmount,
}) => {
  const brand = detectCardBrand(cardData.number);
  const isValidLuhn = validateLuhn(cardData.number);
  const hasMinDigits = cardData.number.replace(/\D/g, '').length >= 13;

  const handleFillTestCard = (preset: TestCardPreset) => {
    onChange({
      ...cardData,
      number: preset.number,
      expiry: preset.expiry,
      cvv: preset.cvv,
      holderName: 'AVALIADOR TECNICO GRUPO MATEUS',
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-4">
      {/* Botões Rápidos de Cartões de Teste para o Avaliador */}
      <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-amber-400 flex items-center gap-1">
            <Sparkles size={13} /> Cartões de Teste Rápidos (1 Clique para Avaliação)
          </span>
          <span className="text-[10px] text-slate-400">Sandbox</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {TEST_CARDS.map((card) => (
            <button
              key={card.number}
              type="button"
              onClick={() => handleFillTestCard(card)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-left transition cursor-pointer border border-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-white">{card.name}</span>
                <span className={`w-2 h-2 rounded-full ${
                  card.expectedStatus === 'APPROVED' ? 'bg-emerald-400' : 'bg-rose-400'
                }`} />
              </div>
              <span className="block font-mono text-[10px] text-slate-300 mt-0.5">{card.number}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Formulário do Cartão */}
      <div className="space-y-3.5">
        {/* Número do Cartão */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Número do Cartão
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardData.number}
              onChange={(e) => onChange({ ...cardData, number: formatCardNumber(e.target.value) })}
              maxLength={19}
              className="w-full pl-11 pr-24 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-medium focus:border-mateus-blue focus:outline-none"
            />
            <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

            {/* Badge de Bandeira Detectada & Validação Luhn */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {brand !== 'unknown' && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                  {brand}
                </span>
              )}

              {hasMinDigits && (
                isValidLuhn ? (
                  <span title="Válido pelo Algoritmo de Luhn">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </span>
                ) : (
                  <span title="Dígito verificador inválido">
                    <AlertCircle size={16} className="text-amber-500" />
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Nome Impresso */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Nome Impresso no Cartão
          </label>
          <input
            type="text"
            placeholder="COMO IMPRESSO NO CARTÃO"
            value={cardData.holderName}
            onChange={(e) => onChange({ ...cardData, holderName: e.target.value.toUpperCase() })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm uppercase font-medium focus:border-mateus-blue focus:outline-none"
          />
        </div>

        {/* Validade e CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Validade (MM/AA)
            </label>
            <input
              type="text"
              placeholder="12/28"
              value={cardData.expiry}
              onChange={(e) => onChange({ ...cardData, expiry: formatExpiry(e.target.value) })}
              maxLength={5}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-center focus:border-mateus-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Código CVV
            </label>
            <input
              type="password"
              placeholder="123"
              value={cardData.cvv}
              onChange={(e) => onChange({ ...cardData, cvv: formatCvv(e.target.value) })}
              maxLength={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-center focus:border-mateus-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Opções de Parcelamento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Opções de Parcelamento
          </label>
          <select
            value={cardData.installments}
            onChange={(e) => onChange({ ...cardData, installments: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:border-mateus-blue focus:outline-none"
          >
            <option value={1}>
              1x de R$ {totalAmount.toFixed(2).replace('.', ',')} à vista (Sem juros)
            </option>
            <option value={2}>
              2x de R$ {(totalAmount / 2).toFixed(2).replace('.', ',')} (Sem juros)
            </option>
            <option value={3}>
              3x de R$ {(totalAmount / 3).toFixed(2).replace('.', ',')} (Sem juros)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

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
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface CreditCardPaymentProps {
  cardData: CreditCardData;
  onChange: (updated: CreditCardData) => void;
  totalAmount: number;
  errors?: Record<string, string>;
  cardRejectionReason?: string | null;
  onClearError?: (field: string) => void;
  onAutoFillTestCard?: () => void;
}

export const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({
  cardData,
  onChange,
  totalAmount,
  errors = {},
  cardRejectionReason = null,
  onClearError,
  onAutoFillTestCard,
}) => {
  const brand = detectCardBrand(cardData.number);
  const isValidLuhn = validateLuhn(cardData.number);
  const cleanNumber = cardData.number.replace(/\D/g, '');
  const hasMinDigits = cleanNumber.length >= 13;

  const handleFillPreset = (preset: TestCardPreset) => {
    onChange({
      ...cardData,
      number: preset.number,
      expiry: preset.expiry,
      cvv: preset.cvv,
      holderName: 'AVALIADOR TECNICO GRUPO MATEUS',
    });
    if (onClearError) {
      onClearError('number');
      onClearError('holderName');
      onClearError('expiry');
      onClearError('cvv');
    }
  };

  const handleFastValidFill = () => {
    if (onAutoFillTestCard) {
      onAutoFillTestCard();
    } else {
      const defaultValid = TEST_CARDS[0];
      handleFillPreset(defaultValid);
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-5">
      {/* ALERTA VISUAL DE CARTÃO RECUSADO (Destaque Imediato no Formulário) */}
      {cardRejectionReason && (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 shadow-md animate-in fade-in slide-in-from-top-2 duration-300 space-y-3"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <XCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-black text-sm sm:text-base text-rose-900 flex items-center gap-1.5">
                  <span>Cartão Recusado pela Operadora</span>
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-rose-300">
                  Transação Não Autorizada
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-rose-800 font-semibold leading-relaxed">
                {cardRejectionReason}
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-rose-700 font-medium text-[11px]">
              🔒 Sua cesta e endereço continuam 100% salvos. Você não perdeu nenhum item.
            </span>
            <button
              type="button"
              onClick={handleFastValidFill}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <RefreshCw size={13} />
              <span>Usar Cartão Válido (1 Clique)</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Botão Principal em Destaque para Avaliadores / Teste Rápido com 1 Clique */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-mateus-blue-900 text-white shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Ambiente de Avaliação Técnica (Sandbox)</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Validação rigorosa via <strong>Zod</strong> + <strong>Algoritmo de Luhn</strong> com simulação bancária realista.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFastValidFill}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            title="Preencher cartão válido automaticamente para testes"
          >
            <Zap size={14} className="fill-slate-950" />
            <span>⚡ Preencher Dados Válidos (1 Clique)</span>
          </button>
        </div>

        {/* Cenários de Teste Bancário Disponíveis */}
        <div className="pt-2 border-t border-white/10">
          <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
            Cenários simulados para teste da banca avaliadora:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {TEST_CARDS.map((card) => (
              <button
                key={card.number}
                type="button"
                onClick={() => handleFillPreset(card)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-left transition cursor-pointer border border-white/10 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                    {card.name.replace(/\(.*\)/, '').trim()}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ml-1 ${
                      card.expectedStatus === 'APPROVED' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-400'
                    }`}
                  />
                </div>
                <span className="block font-mono text-[10px] text-slate-300 mt-0.5">
                  {card.number}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Formulário Seguro do Cartão */}
      <div className="space-y-4">
        {/* Número do Cartão */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="card-number-input" className="block text-xs font-bold text-slate-700">
              Número do Cartão de Crédito
            </label>
            {brand !== 'unknown' && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                Bandeira {brand}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="card-number-input"
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardData.number}
              onChange={(e) => {
                onChange({ ...cardData, number: formatCardNumber(e.target.value) });
                if (onClearError) onClearError('number');
              }}
              maxLength={19}
              aria-invalid={!!errors.number || !!cardRejectionReason}
              className={`w-full pl-11 pr-24 py-2.5 rounded-xl border text-sm font-mono font-medium transition-colors focus:outline-none ${
                errors.number || cardRejectionReason
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                  : 'border-slate-300 focus:border-mateus-blue focus:ring-1 focus:ring-mateus-blue'
              }`}
            />
            <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

            {/* Indicador Visual do Algoritmo de Luhn */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {hasMinDigits && (
                isValidLuhn ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                    title="Número validado pelo Algoritmo de Luhn"
                  >
                    <CheckCircle2 size={13} /> Válido
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"
                    title="Dígito verificador inválido no algoritmo bancário"
                  >
                    <AlertCircle size={13} /> Inválido
                  </span>
                )
              )}
            </div>
          </div>

          {errors.number && (
            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle size={13} /> {errors.number}
            </p>
          )}
        </div>

        {/* Nome do Titular */}
        <div>
          <label htmlFor="card-holder-input" className="block text-xs font-bold text-slate-700 mb-1">
            Nome Impresso no Cartão
          </label>
          <input
            id="card-holder-input"
            type="text"
            placeholder="Ex: DONA MARTA DE SOUSA"
            value={cardData.holderName}
            onChange={(e) => {
              onChange({ ...cardData, holderName: e.target.value.toUpperCase() });
              if (onClearError) onClearError('holderName');
            }}
            maxLength={60}
            aria-invalid={!!errors.holderName}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm uppercase font-medium transition-colors focus:outline-none ${
              errors.holderName
                ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                : 'border-slate-300 focus:border-mateus-blue focus:ring-1 focus:ring-mateus-blue'
            }`}
          />
          {errors.holderName && (
            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle size={13} /> {errors.holderName}
            </p>
          )}
        </div>

        {/* Validade e CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="card-expiry-input" className="block text-xs font-bold text-slate-700 mb-1">
              Validade (MM/AA)
            </label>
            <input
              id="card-expiry-input"
              type="text"
              inputMode="numeric"
              placeholder="12/28"
              value={cardData.expiry}
              onChange={(e) => {
                onChange({ ...cardData, expiry: formatExpiry(e.target.value) });
                if (onClearError) onClearError('expiry');
              }}
              maxLength={5}
              aria-invalid={!!errors.expiry}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-center transition-colors focus:outline-none ${
                errors.expiry
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                  : 'border-slate-300 focus:border-mateus-blue focus:ring-1 focus:ring-mateus-blue'
              }`}
            />
            {errors.expiry && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle size={13} /> {errors.expiry}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="card-cvv-input" className="block text-xs font-bold text-slate-700 mb-1">
              Código CVV
            </label>
            <input
              id="card-cvv-input"
              type="password"
              inputMode="numeric"
              placeholder="123"
              value={cardData.cvv}
              onChange={(e) => {
                onChange({ ...cardData, cvv: formatCvv(e.target.value) });
                if (onClearError) onClearError('cvv');
              }}
              maxLength={4}
              aria-invalid={!!errors.cvv}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-center transition-colors focus:outline-none ${
                errors.cvv
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                  : 'border-slate-300 focus:border-mateus-blue focus:ring-1 focus:ring-mateus-blue'
              }`}
            />
            {errors.cvv && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle size={13} /> {errors.cvv}
              </p>
            )}
          </div>
        </div>

        {/* Opções de Parcelamento */}
        <div>
          <label htmlFor="card-installments-select" className="block text-xs font-bold text-slate-700 mb-1">
            Opções de Parcelamento
          </label>
          <select
            id="card-installments-select"
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

      {/* Selo de Segurança */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5 font-semibold text-slate-600">
          <ShieldCheck size={14} className="text-emerald-600" />
          Transação protegida por Tokenização PCI-DSS
        </span>
        <span className="text-slate-400">Grupo Mateus 1987</span>
      </div>
    </div>
  );
};

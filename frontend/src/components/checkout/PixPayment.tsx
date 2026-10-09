import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, Zap, AlertCircle, Heart, CheckCircle2 } from 'lucide-react';
import { generatePixBrCode } from '@/utils/paymentUtils';

interface PixPaymentProps {
  orderNumber: string;
  totalAmount: number;
  onSimulateBankApproval: () => void;
  onSimulateRejection: () => void;
}

export const PixPayment: React.FC<PixPaymentProps> = ({
  orderNumber,
  totalAmount,
  onSimulateBankApproval,
  onSimulateRejection,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const pixKey = generatePixBrCode(orderNumber, totalAmount);

  // Timer regressivo de expiração do PIX
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/60 border-2 border-emerald-500/30 space-y-4">
      {/* Cabeçalho do PIX com Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Zap size={16} />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-800">
              Pagamento via PIX Instantâneo
            </h4>
            <span className="text-[11px] text-slate-500">
              Sem taxas, compensação em até 10 segundos
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-slate-700 self-start sm:self-auto shadow-xs">
          <Clock size={14} className="text-emerald-600 animate-pulse" />
          <span>Expira em: <strong className="text-emerald-700 font-mono text-sm">{formatTimer(timeLeft)}</strong></span>
        </div>
      </div>

      {/* Área Central: QR Code e Instruções */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* QR Code Ilustrado de Alta Fidelidade */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl border-2 border-slate-200 shadow-sm relative group">
          <div className="relative w-44 h-44 bg-slate-900 p-2.5 rounded-xl flex items-center justify-center">
            {/* Padrão vetorial de QR Code representativo */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-white fill-current"
              shapeRendering="crispEdges"
            >
              {/* Moldura de posicionamento top-left */}
              <rect x="5" y="5" width="25" height="25" fill="none" stroke="white" strokeWidth="4" />
              <rect x="11" y="11" width="13" height="13" />

              {/* Moldura de posicionamento top-right */}
              <rect x="70" y="5" width="25" height="25" fill="none" stroke="white" strokeWidth="4" />
              <rect x="76" y="11" width="13" height="13" />

              {/* Moldura de posicionamento bottom-left */}
              <rect x="5" y="70" width="25" height="25" fill="none" stroke="white" strokeWidth="4" />
              <rect x="11" y="76" width="13" height="13" />

              {/* Módulos de dados do QR Code */}
              <rect x="36" y="8" width="5" height="5" />
              <rect x="44" y="14" width="5" height="5" />
              <rect x="52" y="8" width="5" height="5" />
              <rect x="60" y="18" width="5" height="5" />
              <rect x="12" y="36" width="5" height="5" />
              <rect x="22" y="42" width="5" height="5" />
              <rect x="8" y="52" width="5" height="5" />
              <rect x="76" y="36" width="5" height="5" />
              <rect x="84" y="48" width="5" height="5" />
              <rect x="72" y="56" width="5" height="5" />
              <rect x="36" y="72" width="5" height="5" />
              <rect x="48" y="80" width="5" height="5" />
              <rect x="60" y="74" width="5" height="5" />
              <rect x="80" y="76" width="5" height="5" />
              <rect x="36" y="36" width="28" height="28" fill="#003893" rx="4" />
            </svg>

            {/* Ícone Mateus no Centro do QR Code */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                <Heart size={16} className="fill-mateus-red text-mateus-red" />
              </div>
            </div>
          </div>

          <span className="mt-2 text-[11px] font-bold text-slate-500">
            Aponte a câmera no app do seu banco
          </span>
        </div>

        {/* Chave Copia e Cola & Passo a Passo */}
        <div className="md:col-span-7 space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Ou use o Código PIX Copia e Cola:
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={pixKey}
                aria-label="Código PIX Copia e Cola"
                className="w-full bg-slate-50 text-slate-700 font-mono text-[11px] p-2.5 pr-28 rounded-xl border border-slate-300 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Código PIX copiado com sucesso' : 'Copiar código PIX para área de transferência'}
                className={`absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-300 scale-102'
                    : 'bg-mateus-blue hover:bg-mateus-blue-700 active:scale-95 text-white'
                }`}
              >
                {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={13} />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            {copied && (
              <div
                role="status"
                aria-live="polite"
                className="pix-copied-banner flex items-center gap-2 p-2.5 rounded-xl bg-emerald-100/90 text-emerald-950 border border-emerald-300 text-xs font-bold shadow-xs animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span>Código PIX copiado com sucesso! Abra o app do seu banco e cole na opção Pix Copia e Cola.</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Como funciona?</p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
              <li>Abra o aplicativo do seu banco preferido;</li>
              <li>Escolha a opção <strong>PIX ➔ Ler QR Code</strong> ou <strong>Copia e Cola</strong>;</li>
              <li>Confirme os dados do <strong>Grupo Mateus</strong> e aprove o pagamento.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Caixa de Ferramentas do Avaliador (Simulador de Gateway) */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-amber-400 flex items-center gap-1">
            <Zap size={13} /> Simulador de Gateway Bancário (Para Avaliação Técnica)
          </span>
          <span className="text-[10px] text-slate-400">Sandbox Local</span>
        </div>

        <p className="text-[11px] text-slate-300 leading-tight">
          Como este teste roda em ambiente de demonstração, você pode simular a notificação do banco com 1 clique:
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onSimulateBankApproval}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
          >
            <Check size={14} />
            <span>Simular Pagamento Aprovado no App do Banco</span>
          </button>

          <button
            type="button"
            onClick={onSimulateRejection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition cursor-pointer"
          >
            <AlertCircle size={14} />
            <span>Simular Falha / Expirado</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface CaderninhoPaymentProps {
  totalAmount: number;
}

export const CaderninhoPayment: React.FC<CaderninhoPaymentProps> = ({ totalAmount }) => {
  const { user, isAuthenticated, simulateLoginAsDonaMarta, simulateLoginAsPedro } = useAuthStore();

  const userLimit = user?.caderninhoLimit ?? 0;
  const hasLimit = isAuthenticated && userLimit >= totalAmount;
  const remainingLimit = Math.max(0, userLimit - totalAmount);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-mateus-sky-50 border-2 border-mateus-blue/30 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-mateus-blue text-white flex items-center justify-center shrink-0 shadow-md">
          <BookOpen size={20} />
        </div>

        <div>
          <h4 className="text-sm sm:text-base font-black text-mateus-blue-900 leading-tight">
            Caderninho Digital do Seu Osvaldo (1987)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Crédito de confiança baseado no relacionamento do balcão da esquina. Pague no dia 10 do mês seguinte sem taxa de juros!
          </p>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>Você precisa estar conectado para utilizar o limite do Caderninho:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={simulateLoginAsDonaMarta}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mateus-blue text-white text-xs font-bold hover:bg-mateus-blue-700 transition cursor-pointer"
            >
              <UserCheck size={13} />
              <span>Entrar como Dona Marta (R$ 800)</span>
            </button>

            <button
              type="button"
              onClick={simulateLoginAsPedro}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition cursor-pointer"
            >
              <UserCheck size={13} />
              <span>Entrar como Pedro (R$ 200)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Cliente Titular</span>
            <span className="text-xs sm:text-sm font-black text-slate-800 truncate block">
              {user?.name}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Limite Atual</span>
            <span className="text-xs sm:text-sm font-black text-slate-800">
              R$ {userLimit.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${hasLimit ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Saldo Restante</span>
            <span className={`text-xs sm:text-sm font-black ${hasLimit ? 'text-emerald-700' : 'text-rose-600'}`}>
              R$ {remainingLimit.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      )}

      {isAuthenticated && hasLimit && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Compra 100% coberta pelo seu crédito de confiança. Aprovação instantânea ao clicar em confirmar!</span>
        </div>
      )}

      {isAuthenticated && !hasLimit && (
        <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
          <AlertTriangle size={16} className="shrink-0" />
          <span>O valor da compra (R$ {totalAmount.toFixed(2).replace('.', ',')}) ultrapassa o limite disponível do seu caderninho. Escolha PIX ou Cartão de Crédito.</span>
        </div>
      )}
    </div>
  );
};

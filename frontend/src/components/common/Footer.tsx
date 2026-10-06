import React from 'react';
import { Heart, BookOpen, PhoneCall, ShieldCheck, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-mateus-blue-900 text-white mt-16 border-t-4 border-mateus-red">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* History of 1987 - Seu Osvaldo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-mateus-sky-100 font-bold text-sm">
              <BookOpen size={18} className="text-mateus-sky-400" />
              <span>Nossa Tradição desde 1987</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Do caderninho azul para a palma da sua mão
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tudo começou no balcão da esquina do Seu Osvaldo em 1987, onde cada cliente era chamado pelo nome e anotado com carinho no caderninho de capa azul. Hoje unimos essa proximidade humana à conveniência digital.
            </p>
          </div>

          {/* Customer Care for Dona Marta & All Customers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-mateus-sky-100 font-bold text-sm">
              <PhoneCall size={18} className="text-mateus-sky-400" />
              <span>Atendimento Humanizado</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Precisa de ajuda com a sua compra?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Nossa equipe tem carinho especial para tirar dúvidas e ajudar passo a passo. Sem robôs complicados!
            </p>
            <div className="bg-mateus-blue-800/80 p-3 rounded-xl border border-mateus-blue-700 space-y-1 text-xs">
              <p className="font-semibold text-mateus-sky-200 flex items-center gap-1.5">
                <Clock size={14} /> Atendimento de Segunda a Sábado: 07h às 21h
              </p>
              <p className="text-white font-bold text-sm">
                📞 0800 700 1987 (Ligação Gratuita)
              </p>
            </div>
          </div>

          {/* Mascote Dentinho & Security */}
          <div className="space-y-3 flex flex-col items-start md:items-end text-left md:text-right">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-dentinho">
                <img
                  src="/mascote/dentinho-ola.svg"
                  alt="Mascote Dentinho"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-mateus-sky-300 uppercase tracking-wider">
                  Mascote Oficial
                </p>
                <p className="text-base font-extrabold text-white">
                  Dentinho, o Castor
                </p>
                <p className="text-[11px] text-slate-300">
                  Cuidando da sua economia desde os anos 90!
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-mateus-blue-800/60 px-3 py-1.5 rounded-lg border border-mateus-blue-700">
              <ShieldCheck size={16} />
              <span>Ambiente Seguro com JWT & Spring Security</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-mateus-blue-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>Supermercado Grupo Mateus © 1987–2026.</span>
            <span className="flex items-center gap-1 text-white font-semibold">
              Feito com <Heart size={13} className="fill-mateus-red text-mateus-red" /> Você no Coração da Gente.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Desafio Técnico 2026</span>
            <span>•</span>
            <span>WCAG 2.1 AA Acessível</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

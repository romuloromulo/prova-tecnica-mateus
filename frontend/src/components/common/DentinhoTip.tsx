import React from 'react';
import { X, Sparkles } from 'lucide-react';

export type DentinhoVariant = 'ola' | 'carrinho' | 'sucesso';

interface DentinhoTipProps {
  variant?: DentinhoVariant;
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
}

const variantImages: Record<DentinhoVariant, { src: string; alt: string; defaultTitle: string; badgeColor: string }> = {
  ola: {
    src: '/mascote/dentinho-ola.svg',
    alt: 'Mascote Dentinho acenando com carinho',
    defaultTitle: 'Oi! Sou o Dentinho!',
    badgeColor: 'bg-mateus-sky-50 text-mateus-sky-600 border-mateus-sky-200',
  },
  carrinho: {
    src: '/mascote/dentinho-carrinho.svg',
    alt: 'Mascote Dentinho empurrando carrinho com ofertas',
    defaultTitle: 'Dica de Economia do Dentinho',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  sucesso: {
    src: '/mascote/dentinho-sucesso.svg',
    alt: 'Mascote Dentinho comemorando com alegria',
    defaultTitle: 'Tudo Certo! Viva!',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

export const DentinhoTip: React.FC<DentinhoTipProps> = ({
  variant = 'ola',
  title,
  message,
  actionText,
  onAction,
  onClose,
  className = '',
}) => {
  const current = variantImages[variant];
  const displayTitle = title || current.defaultTitle;

  return (
    <div
      role="region"
      aria-label="Dica do Mascote Dentinho"
      className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-white border-2 border-mateus-sky-100 shadow-dentinho transition-all ${className}`}
    >
      {/* Mascote Avatar */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-mateus-sky-50 via-white to-amber-50 p-1.5 border border-mateus-sky-200 shadow-sm flex items-center justify-center">
          <img
            src={current.src}
            alt={current.alt}
            className="w-full h-full object-contain animate-bounce [animation-duration:3s]"
          />
        </div>
        <span
          className="absolute -bottom-1 -right-1 p-1 rounded-full bg-mateus-red text-white shadow-sm"
          title="Mascote Oficial Grupo Mateus"
        >
          <Sparkles size={11} aria-hidden="true" />
        </span>
      </div>

      {/* Speech Bubble Content */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${current.badgeColor}`}
          >
            {displayTitle}
          </span>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar recado do mascote Dentinho"
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <p className="text-slate-700 text-sm leading-relaxed font-medium">
          {message}
        </p>

        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-2.5 inline-flex items-center text-xs font-bold text-mateus-blue hover:text-mateus-red transition underline underline-offset-4"
          >
            {actionText} →
          </button>
        )}
      </div>
    </div>
  );
};

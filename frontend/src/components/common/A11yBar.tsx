import React from 'react';
import { Eye, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import { useA11y } from '@/hooks/useA11y';

export const A11yBar: React.FC = () => {
  const { fontSize, highContrast, increaseFont, decreaseFont, resetFont, toggleHighContrast } = useA11y();

  const zoomLabel =
    fontSize === 'normal' ? '100%' : fontSize === 'lg' ? '120%' : '140%';

  return (
    <aside
      aria-label="Barra de acessibilidade"
      className="bg-mateus-blue-900 text-white text-xs py-1.5 px-4 border-b border-mateus-blue-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-mateus-sky-100 font-medium">
          <span className="hidden sm:inline">💙 Bem-vindo ao Supermercado "Você no Coração da Gente"</span>
          <span className="sm:hidden">💙 Do balcão para a palma da mão</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-slate-300 mr-1 hidden md:inline">Acessibilidade:</span>

          {/* Diminuir fonte */}
          <button
            type="button"
            onClick={decreaseFont}
            disabled={fontSize === 'normal'}
            aria-label="Diminuir tamanho da fonte"
            title="Diminuir tamanho do texto"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mateus-blue-800 hover:bg-mateus-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition cursor-pointer"
          >
            <ZoomOut size={14} aria-hidden="true" />
            <span>A-</span>
          </button>

          {/* Resetar fonte / Indicador do Zoom Atual */}
          <button
            type="button"
            onClick={resetFont}
            aria-label={`Tamanho do texto atual: ${zoomLabel}. Clique para redefinir ao padrão`}
            title="Redefinir tamanho do texto para padrão (100%)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              fontSize === 'normal'
                ? 'bg-mateus-sky-500 text-white shadow-xs'
                : 'bg-mateus-blue-800 hover:bg-mateus-blue-700 text-mateus-sky-200'
            }`}
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Padrão ({zoomLabel})</span>
          </button>

          {/* Aumentar fonte (Ideal para Dona Marta) */}
          <button
            type="button"
            onClick={increaseFont}
            disabled={fontSize === 'xl'}
            aria-label="Aumentar tamanho da fonte"
            title="Aumentar tamanho do texto (Ideal para leitura confortável)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              fontSize !== 'normal'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-mateus-blue-800 hover:bg-mateus-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white'
            }`}
          >
            <ZoomIn size={14} aria-hidden="true" />
            <span>A+</span>
            {fontSize !== 'normal' && <Sparkles size={11} className="fill-slate-950" />}
          </button>

          {/* Alto Contraste */}
          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
            title="Alternar modo de alto contraste para maior nitidez"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ml-1 sm:ml-2 cursor-pointer ${
              highContrast
                ? 'bg-yellow-400 text-black ring-2 ring-white shadow-xs'
                : 'bg-mateus-blue-800 hover:bg-mateus-blue-700 text-white'
            }`}
          >
            <Eye size={14} aria-hidden="true" />
            <span>{highContrast ? 'Contraste: Ligado' : 'Alto Contraste'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

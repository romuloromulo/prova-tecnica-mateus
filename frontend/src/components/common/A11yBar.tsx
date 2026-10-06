import React from 'react';
import { Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useA11y } from '@/hooks/useA11y';

export const A11yBar: React.FC = () => {
  const { fontSize, highContrast, increaseFont, decreaseFont, resetFont, toggleHighContrast } = useA11y();

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
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-mateus-blue-800 hover:bg-mateus-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            <ZoomOut size={14} aria-hidden="true" />
            <span>A-</span>
          </button>

          {/* Resetar fonte */}
          <button
            type="button"
            onClick={resetFont}
            aria-label="Tamanho de fonte normal"
            title="Redefinir tamanho do texto para padrão"
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition ${
              fontSize === 'normal'
                ? 'bg-mateus-sky-500 text-white'
                : 'bg-mateus-blue-800 hover:bg-mateus-blue-700 text-white'
            }`}
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Padrão</span>
          </button>

          {/* Aumentar fonte (Ideal para Dona Marta) */}
          <button
            type="button"
            onClick={increaseFont}
            disabled={fontSize === 'xl'}
            aria-label="Aumentar tamanho da fonte"
            title="Aumentar tamanho do texto (Ideal para leitura confortável)"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-mateus-blue-800 hover:bg-mateus-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            <ZoomIn size={14} aria-hidden="true" />
            <span>A+</span>
          </button>

          {/* Alto Contraste */}
          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
            title="Alternar modo de alto contraste para maior nitidez"
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition ml-1 sm:ml-2 ${
              highContrast
                ? 'bg-yellow-400 text-black ring-2 ring-white'
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

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  // Gera páginas para exibição
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Navegação entre páginas de produtos"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200"
    >
      <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center sm:text-left">
        Mostrando <strong className="text-slate-800">{startItem}</strong> a{' '}
        <strong className="text-slate-800">{endItem}</strong> de{' '}
        <strong className="text-slate-800">{totalElements}</strong> itens
      </p>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Botão Anterior */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          className="flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-white border border-slate-200 hover:bg-mateus-blue-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Páginas numeradas */}
        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center transition ${
                  isCurrent
                    ? 'bg-mateus-blue text-white shadow-soft ring-2 ring-mateus-blue/20'
                    : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Botão Próxima */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Próxima página"
          className="flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-white border border-slate-200 hover:bg-mateus-blue-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition"
        >
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};

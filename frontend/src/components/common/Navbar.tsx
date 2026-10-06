import React from 'react';
import { Apple, Beef, Croissant, Package, Sparkles, Grid } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos os Setores', icon: <Grid size={16} /> },
  { id: 'hortifruti', name: 'Hortifrúti', icon: <Apple size={16} /> },
  { id: 'acougue', name: 'Açougue & Carnes', icon: <Beef size={16} /> },
  { id: 'padaria', name: 'Padaria Fresquinha', icon: <Croissant size={16} /> },
  { id: 'mercearia', name: 'Mercearia Básica', icon: <Package size={16} /> },
  { id: 'limpeza', name: 'Higiene & Limpeza', icon: <Sparkles size={16} /> },
];

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory = 'all',
  onSelectCategory,
}) => {
  return (
    <nav
      aria-label="Navegação por categorias de produtos"
      className="bg-white border-b border-slate-200/80 shadow-xs overflow-x-auto scrollbar-none"
    >
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center gap-1 sm:gap-2 py-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onSelectCategory?.(cat.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-mateus-blue text-white shadow-soft'
                      : 'text-slate-700 hover:text-mateus-blue hover:bg-mateus-blue-50/60'
                  }`}
                >
                  <span className={isActive ? 'text-mateus-sky-100' : 'text-mateus-sky-600'}>
                    {cat.icon}
                  </span>
                  <span>{cat.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

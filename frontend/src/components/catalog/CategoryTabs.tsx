import React from 'react';
import { Apple, Beef, Croissant, Package, Sparkles, LayoutGrid } from 'lucide-react';
import type { ProductCategory } from '@/types/product';

export interface CategoryTabItem {
  id: ProductCategory | 'all';
  name: string;
  icon: React.ReactNode;
  subtitle: string;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  { id: 'all', name: 'Todos os Setores', icon: <LayoutGrid size={18} />, subtitle: 'Ofertas gerais' },
  { id: 'hortifruti', name: 'Hortifrúti', icon: <Apple size={18} />, subtitle: 'Frutas & Verduras' },
  { id: 'acougue', name: 'Açougue & Carnes', icon: <Beef size={18} />, subtitle: 'Cortes selecionados' },
  { id: 'padaria', name: 'Padaria Fresquinha', icon: <Croissant size={18} />, subtitle: 'Pães & Bolos' },
  { id: 'mercearia', name: 'Mercearia Básica', icon: <Package size={18} />, subtitle: 'Arroz, Café & Grãos' },
  { id: 'limpeza', name: 'Higiene & Limpeza', icon: <Sparkles size={18} />, subtitle: 'Casa cheirosa' },
];

interface CategoryTabsProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (id: ProductCategory | 'all') => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <nav
      aria-label="Filtro de setores do supermercado"
      className="w-full bg-white rounded-3xl p-2 sm:p-2.5 border border-slate-200/90 shadow-card"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = categoryCounts ? categoryCounts[tab.id] : undefined;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-mateus-blue text-white shadow-soft ring-2 ring-mateus-blue/20'
                  : 'text-slate-700 hover:text-mateus-blue hover:bg-slate-100/80'
              }`}
            >
              <span className={isActive ? 'text-mateus-sky-200' : 'text-mateus-sky-600'}>
                {tab.icon}
              </span>

              <span>{tab.name}</span>

              {count !== undefined && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { PaginationBar } from './PaginationBar';
import { SearchInput } from './SearchInput';
import { CategoryTabs } from './CategoryTabs';
import { productService } from '@/services/productService';
import type { ProductCategory, PaginatedProducts } from '@/types/product';
import { Sparkles, RefreshCcw } from 'lucide-react';

interface ProductGridProps {
  initialCategory?: ProductCategory | 'all';
  selectedCategory?: ProductCategory | 'all';
  onCategoryChange?: (cat: ProductCategory | 'all') => void;
  onAddedFeedback?: (message: string) => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

const sectorTitles: Record<ProductCategory | 'all', { title: string; desc: string }> = {
  all: {
    title: 'Catálogo Completo do Supermercado',
    desc: 'Todos os setores reunidos com a tradição e o melhor preço do Grupo Mateus.',
  },
  hortifruti: {
    title: 'Setor de Hortifrúti & Frutas Frescas',
    desc: 'Colhidos diariamente do campo direto para a mesa da sua família.',
  },
  acougue: {
    title: 'Açougue & Carnes de Primeira',
    desc: 'Cortes nobres, selecionados com rigor e inspecionados para sua segurança.',
  },
  padaria: {
    title: 'Padaria Fresquinha & Confeitaria',
    desc: 'Pães quentinhos saindo do forno a toda hora e receitas tradicionais de 1987.',
  },
  mercearia: {
    title: 'Mercearia Básica do Seu Osvaldo',
    desc: 'Arroz, feijão, café moído e tudo o que não pode faltar na despensa.',
  },
  limpeza: {
    title: 'Setor de Higiene & Limpeza',
    desc: 'Produtos de alta eficiência para deixar sua casa protegida e perfumada.',
  },
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  initialCategory = 'all',
  selectedCategory,
  onCategoryChange,
  onAddedFeedback,
  searchTerm: externalSearch = '',
  onSearchChange: setExternalSearch,
}) => {
  const [internalCategory, setInternalCategory] = useState<ProductCategory | 'all'>(
    selectedCategory !== undefined ? selectedCategory : initialCategory
  );
  const category = selectedCategory !== undefined ? selectedCategory : internalCategory;

  const [internalSearch, setInternalSearch] = useState<string>(externalSearch);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PaginatedProducts>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 8,
  });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Sincroniza busca externa (do Header) se houver
  useEffect(() => {
    setInternalSearch(externalSearch);
    setCurrentPage(1);
  }, [externalSearch]);

  // Carrega contagens de categorias
  useEffect(() => {
    productService.getCategoriesCount().then(setCategoryCounts);
  }, []);

  // Busca produtos da API / Mock
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    productService
      .getProducts({
        category,
        search: internalSearch,
        page: currentPage,
        size: 8,
      })
      .then((res) => {
        if (!isCancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [category, internalSearch, currentPage]);

  const handleCategorySelect = (newCategory: ProductCategory | 'all') => {
    setInternalCategory(newCategory);
    onCategoryChange?.(newCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setInternalSearch(val);
    setExternalSearch?.(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setInternalCategory('all');
    onCategoryChange?.('all');
    setInternalSearch('');
    setExternalSearch?.('');
    setCurrentPage(1);
  };

  const sectorInfo = sectorTitles[category];

  return (
    <section aria-labelledby="catalog-heading" className="space-y-6">
      {/* Abas de Setores do Supermercado */}
      <div className="space-y-3">
        <CategoryTabs
          activeCategory={category}
          onSelectCategory={handleCategorySelect}
          categoryCounts={categoryCounts}
        />

        {/* Barra de Busca Dedicada com Debounce */}
        <div className="max-w-xl">
          <SearchInput
            value={internalSearch}
            onChange={handleSearchChange}
            placeholder={`Buscar em ${category === 'all' ? 'todos os setores' : sectorInfo.title}...`}
          />
        </div>
      </div>

      {/* Cabeçalho do Setor Ativo */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2">
        <div>
          <div className="flex items-center gap-1.5 text-mateus-sky-600 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Setor Ativo</span>
          </div>
          <h2 id="catalog-heading" className="text-2xl sm:text-3xl font-black text-mateus-blue-900 tracking-tight">
            {sectorInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {internalSearch ? (
              <>
                Exibindo resultados para a busca: <strong className="text-mateus-blue">"{internalSearch}"</strong>
              </>
            ) : (
              sectorInfo.desc
            )}
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 shrink-0">
          {loading ? 'Carregando itens...' : `${data.totalElements} produtos encontrados`}
        </span>
      </div>

      {/* Estados: Loading (Skeletons) vs Vazio vs Grade de Cards */}
      {loading ? (
        <div
          role="status"
          aria-label="Carregando produtos"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 animate-pulse space-y-4 shadow-xs"
            >
              <div className="h-5 w-24 bg-slate-200 rounded-full" />
              <div className="h-6 w-3/4 bg-slate-200 rounded-xl" />
              <div className="h-4 w-full bg-slate-100 rounded-lg" />
              <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-7 w-20 bg-slate-200 rounded-lg" />
                <div className="h-9 w-24 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : data.content.length === 0 ? (
        /* Estado Vazio Amigável com Mascote Dentinho */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-mateus-sky-50 p-2 border border-mateus-sky-200 flex items-center justify-center shadow-dentinho">
            <img
              src="/mascote/dentinho-ola.svg"
              alt="Mascote Dentinho com dúvida"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800">
              Ops, vizinho! Não encontramos nenhum produto.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              O Seu Osvaldo e o Dentinho procuraram na prateleira, mas não achamos nada com o termo digitado. Tente buscar com outra palavra ou limpe o filtro!
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-mateus-blue hover:bg-mateus-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-soft transition"
          >
            <RefreshCcw size={16} />
            <span>Ver Todos os Setores</span>
          </button>
        </div>
      ) : (
        /* Grade de Produtos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {data.content.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddedFeedback={onAddedFeedback}
            />
          ))}
        </div>
      )}

      {/* Barra de Paginação */}
      {!loading && data.totalPages > 1 && (
        <PaginationBar
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          pageSize={data.pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { PaginationBar } from './PaginationBar';
import { productService } from '@/services/productService';
import type { ProductCategory, PaginatedProducts } from '@/types/product';
import { Sparkles, RefreshCcw, Filter, X } from 'lucide-react';

interface ProductGridProps {
  selectedCategory?: ProductCategory | 'all';
  onCategoryChange?: (cat: ProductCategory | 'all') => void;
  onAddedFeedback?: (message: string) => void;
  searchTerm?: string;
  onClearSearch?: () => void;
}

const sectorTitles: Record<ProductCategory | 'all', { title: string; desc: string }> = {
  all: {
    title: 'Todos os Setores',
    desc: 'O supermercado completo com a tradição de preço justo e confiança do Grupo Mateus.',
  },
  hortifruti: {
    title: 'Hortifrúti & Frutas Frescas',
    desc: 'Colhidos diariamente do campo com a máxima qualidade e frescor.',
  },
  acougue: {
    title: 'Açougue & Carnes de Primeira',
    desc: 'Cortes nobres, carnes macias e inspecionadas no balcão do Seu Osvaldo.',
  },
  padaria: {
    title: 'Padaria Fresquinha & Confeitaria',
    desc: 'Pães quentinhos saindo do forno a toda hora e bolos caseiros tradicionais.',
  },
  mercearia: {
    title: 'Mercearia Básica do Seu Osvaldo',
    desc: 'Arroz, feijão, café moído e itens essenciais que nunca podem faltar.',
  },
  limpeza: {
    title: 'Higiene & Limpeza da Casa',
    desc: 'Produtos de alta eficiência para manter sua casa perfumada e protegida.',
  },
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory = 'all',
  onCategoryChange,
  onAddedFeedback,
  searchTerm = '',
  onClearSearch,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PaginatedProducts>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 8,
  });

  // Reseta para a primeira página ao mudar setor ou termo de busca
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Busca produtos da API com fallback robusto
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    productService
      .getProducts({
        category: selectedCategory,
        search: searchTerm,
        page: currentPage,
        size: 8,
      })
      .then((res) => {
        if (!isCancelled) {
          if (res && Array.isArray(res.content)) {
            setData(res);
          } else {
            setData({
              content: [],
              totalElements: 0,
              totalPages: 1,
              currentPage: 1,
              pageSize: 8,
            });
          }
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
  }, [selectedCategory, searchTerm, currentPage]);

  const sectorInfo = sectorTitles[selectedCategory] || sectorTitles.all;
  const products = Array.isArray(data?.content) ? data.content : [];

  return (
    <section id="catalogo-produtos" aria-labelledby="catalog-heading" className="scroll-mt-32 space-y-6">
      {/* Cabeçalho do Setor Ativo & Filtros Aplicados */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-1.5 text-mateus-sky-600 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Setor Ativo</span>
          </div>

          <h2 id="catalog-heading" className="text-2xl sm:text-3xl font-black text-mateus-blue-900 tracking-tight">
            {sectorInfo.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            {searchTerm ? (
              <span>
                Filtrando por: <strong className="text-mateus-blue">"{searchTerm}"</strong>
              </span>
            ) : (
              sectorInfo.desc
            )}
          </p>

          {/* Tags de Filtros Ativos com Botão de Limpar */}
          {(selectedCategory !== 'all' || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Filter size={12} /> Filtros:
              </span>

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-mateus-blue-50 text-mateus-blue border border-mateus-blue-200">
                  <span>Setor: {sectorInfo.title}</span>
                  <button
                    type="button"
                    onClick={() => onCategoryChange?.('all')}
                    aria-label="Remover filtro de setor"
                    className="hover:text-mateus-red p-0.5 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span>Busca: "{searchTerm}"</span>
                  <button
                    type="button"
                    onClick={() => onClearSearch?.()}
                    aria-label="Limpar termo de busca"
                    className="hover:text-mateus-red p-0.5 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <span className="text-xs font-bold text-slate-500 shrink-0 self-start sm:self-auto">
          {loading ? 'Consultando prateleiras...' : `${data?.totalElements || 0} produtos encontrados`}
        </span>
      </div>

      {/* Estados: Loading vs Vazio vs Grade de Produtos */}
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
      ) : products.length === 0 ? (
        /* Estado Vazio Amigável */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-mateus-sky-50 p-2 border border-mateus-sky-200 flex items-center justify-center shadow-dentinho">
            <img
              src="/mascote/dentinho-ola.svg"
              alt="Mascote Dentinho com dúvida"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">
              Ops, vizinho! Não encontramos nenhum produto.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              O Seu Osvaldo e o Dentinho procuraram em todo o setor, mas não encontramos nada com o termo buscado. Que tal explorar outros setores da loja?
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onCategoryChange?.('all');
              onClearSearch?.();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-mateus-blue hover:bg-mateus-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-soft transition"
          >
            <RefreshCcw size={16} />
            <span>Ver Todos os Setores</span>
          </button>
        </div>
      ) : (
        /* Grade de Produtos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddedFeedback={onAddedFeedback}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {!loading && (data?.totalPages || 0) > 1 && (
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

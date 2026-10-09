import React, { useState } from 'react';
import { Heart, Plus, Minus, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  onAddedFeedback?: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddedFeedback,
}) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find((i) => i?.product?.id === product?.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = (product?.stockQuantity ?? 0) <= 0;
  const isLowStock = (product?.stockQuantity ?? 0) > 0 && (product?.stockQuantity ?? 0) <= 5;

  const handleAdd = () => {
    if (isOutOfStock) return;
    const res = addItem(product, 1);
    if (res.success) {
      onAddedFeedback?.(`✓ ${product.name} adicionado à cesta!`);
    } else if (res.message) {
      onAddedFeedback?.(res.message);
    }
  };

  const handleIncrement = () => {
    if (currentQuantity >= product.stockQuantity) {
      onAddedFeedback?.(`Limite de estoque atingido (${product.stockQuantity} un disponíveis).`);
      return;
    }
    updateQuantity(product.id, currentQuantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, currentQuantity - 1);
  };

  return (
    <article
      aria-label={`Produto: ${product.name}`}
      className="product-card bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
    >
      <div>
        {/* Foto do Produto com Badges Integrados */}
        <div className="relative w-full aspect-square rounded-2xl bg-slate-100 overflow-hidden mb-3.5 border border-slate-200/70 flex items-center justify-center group-hover:border-mateus-sky-200 transition-colors">
          {product.imageUrl && !imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400 w-full h-full bg-slate-50">
              <Package size={36} className="text-slate-300 mb-1" />
              <span className="text-[11px] font-bold text-slate-400 capitalize">{product.category}</span>
            </div>
          )}

          {/* Badges Flutuantes sobre a Foto */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            <span className="product-badge-category text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-mateus-sky-700 border border-slate-200/80 shadow-xs">
              {product.category}
            </span>

            {product.isPromotion && (
              <span className="product-badge-promo text-[10px] font-black px-2 py-0.5 rounded-full bg-mateus-red text-white flex items-center gap-1 shadow-sm">
                <Heart size={10} className="fill-white text-white" />
                <span>Oferta</span>
              </span>
            )}
          </div>

          {/* Unidade no Canto Inferior Direito da Foto */}
          {product.unit && (
            <span className="product-badge-unit absolute bottom-2 right-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-white shadow-xs">
              {product.unit}
            </span>
          )}
        </div>

        {/* Título e Descrição */}
        <h3 className="product-title font-extrabold text-base sm:text-lg text-slate-800 leading-snug group-hover:text-mateus-blue transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Indicador de Estoque Semântico */}
        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
          {isOutOfStock ? (
            <span className="stock-badge-out inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
              <AlertTriangle size={13} /> Esgotado temporariamente
            </span>
          ) : isLowStock ? (
            <span className="stock-badge-low inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              <AlertTriangle size={13} /> Restam apenas {product.stockQuantity} un!
            </span>
          ) : (
            <span className="stock-badge-ok inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 size={13} /> {product.stockQuantity} disponíveis
            </span>
          )}
        </div>
      </div>

      {/* Preço e Botão de Ação */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5">
        <div className="shrink-0 whitespace-nowrap">
          <span className="product-price-label text-[10px] sm:text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">
            Preço Amigo
          </span>
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="product-price text-xl sm:text-2xl font-black text-mateus-blue whitespace-nowrap inline-flex items-baseline">
              <span className="text-xs sm:text-sm font-bold mr-0.5 select-none">R$</span>
              <span>{product.price.toFixed(2).replace('.', ',')}</span>
            </span>
            {product.unit && (
              <span className="product-price-unit text-[11px] sm:text-xs text-slate-400 font-bold whitespace-nowrap">
                /{product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Botão de Adicionar / Contador de Quantidade */}
        {currentQuantity === 0 ? (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            aria-label={`Adicionar ${product.name} à cesta`}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-mateus-red hover:bg-mateus-red-hover text-white text-xs sm:text-sm font-extrabold shadow-heart transition transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Colocar na Cesta</span>
            <span className="sm:hidden">Adicionar</span>
          </button>
        ) : (
          <div
            role="group"
            aria-label={`Quantidade de ${product.name} na cesta`}
            className="flex items-center gap-1 bg-mateus-blue-50 p-1 rounded-2xl border border-mateus-blue-200 shadow-xs"
          >
            <button
              type="button"
              onClick={handleDecrement}
              aria-label={`Diminuir quantidade de ${product.name}`}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-black flex items-center justify-center transition shadow-xs"
            >
              <Minus size={15} />
            </button>

            <span className="min-w-[28px] text-center font-black text-sm text-mateus-blue">
              {currentQuantity}
            </span>

            <button
              type="button"
              onClick={handleIncrement}
              disabled={currentQuantity >= product.stockQuantity}
              aria-label={`Aumentar quantidade de ${product.name}`}
              className="w-8 h-8 rounded-xl bg-mateus-blue hover:bg-mateus-blue-700 text-white font-black flex items-center justify-center transition shadow-xs disabled:opacity-40"
            >
              <Plus size={15} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

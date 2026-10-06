import React from 'react';
import type { CartItem } from '@/types/cart';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number | string, newQuantity: number) => void;
  onRemove: (productId: number | string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;
  const isMaxStock = quantity >= product.stockQuantity;
  const subtotal = product.price * quantity;

  return (
    <div className="group relative flex items-start sm:items-center gap-3.5 py-4 px-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 hover:border-mateus-sky-200 transition-all duration-200">
      {/* Imagem do Produto com Badge de Categoria */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-1.5 border border-slate-200/80 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback caso imagem externa falhe
            (e.target as HTMLImageElement).src = '/favicon.svg';
          }}
        />
        <span className="absolute bottom-1 right-1 text-[9px] font-black uppercase tracking-wider px-1 py-0.5 rounded bg-mateus-blue/90 text-white">
          {product.unit}
        </span>
      </div>

      {/* Detalhes do Produto */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight group-hover:text-mateus-blue transition-colors line-clamp-1">
              {product.name}
            </h4>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              R$ {product.price.toFixed(2).replace('.', ',')} / {product.unit}
            </p>
          </div>

          {/* Botão de Excluir */}
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            aria-label={`Remover ${product.name} da cesta`}
            className="text-slate-400 hover:text-mateus-red p-1 rounded-lg hover:bg-rose-50 transition-colors"
            title="Remover produto da cesta"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Controles de Quantidade e Subtotal */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {/* Controles de incremento/decremento com toque amplo para acessibilidade */}
          <div className="inline-flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              aria-label={`Diminuir quantidade de ${product.name}`}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <Minus size={13} />
            </button>

            <span
              className="w-7 sm:w-8 text-center text-xs sm:text-sm font-black text-slate-800"
              aria-live="polite"
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              disabled={isMaxStock}
              aria-label={`Aumentar quantidade de ${product.name}`}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black flex items-center justify-center transition active:scale-95 cursor-pointer ${
                isMaxStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                  : 'bg-mateus-blue hover:bg-mateus-blue-700 text-white shadow-xs'
              }`}
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Subtotal do Item */}
          <div className="text-right">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Subtotal</span>
            <span className="text-xs sm:text-sm font-black text-mateus-blue">
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Alerta de Estoque Máximo Atingido */}
        {isMaxStock && (
          <p className="mt-1.5 text-[10px] sm:text-[11px] font-bold text-amber-600 flex items-center gap-1">
            <AlertCircle size={12} className="shrink-0" />
            <span>Limite disponível no balcão: {product.stockQuantity} {product.unit}s</span>
          </p>
        )}
      </div>
    </div>
  );
};

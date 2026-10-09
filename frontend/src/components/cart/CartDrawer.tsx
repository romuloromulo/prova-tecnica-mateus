import React, { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { X, ShoppingBag, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getSubtotal,
  } = useCartStore();

  const { user } = useAuthStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Estados para controlar o ciclo de vida e a transição suave de entrada e saída
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setShouldRender(true);
      // Pequeno atraso (25ms) garante que o elemento foi pintado no DOM com translate-x-full antes de iniciar o slide-in
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 25);
    } else {
      setIsVisible(false);
      // Aguarda os 300ms exatos da transição de slide-out antes de desmontar o componente
      timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  // Fecha com a tecla ESC e trava o scroll da página enquanto o drawer estiver aberto
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowClearConfirm(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shouldRender) {
        if (showClearConfirm) {
          setShowClearConfirm(false);
        } else {
          closeCart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, closeCart, showClearConfirm]);

  if (!shouldRender) return null;

  const validItems = items.filter(
    (i) => i && i.product && i.product.id && typeof i.product.price === 'number'
  );
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  const handleExploreShop = () => {
    closeCart();
    const catalogEl = document.getElementById('catalogo-produtos');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    closeCart();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cesta de compras"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop com desfoque e transição suave de opacidade (fade in / fade out) */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        {/* Painel Deslizante Moderno (slide in / slide out suave pela direita) */}
        <div
          ref={drawerRef}
          className={`cart-drawer-panel w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Cabeçalho do Drawer */}
          <div className="px-5 py-4 sm:px-6 bg-mateus-blue text-white flex items-center justify-between shadow-soft shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black leading-tight flex items-center gap-2">
                  <span>Sua Cesta de Compras</span>
                  {totalItems > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-mateus-red text-white text-xs font-black">
                      {totalItems}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-mateus-sky-100 font-medium">
                  Você no Coração da Gente • Grupo Mateus
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              aria-label="Fechar cesta de compras"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal / Toast de Confirmação para Esvaziar Cesta */}
          {showClearConfirm && (
            <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-900 flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2 text-xs">
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Deseja realmente esvaziar sua cesta?</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Todos os itens adicionados serão removidos.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 text-xs font-black text-white bg-mateus-red rounded-lg hover:bg-mateus-red-hover transition shadow-xs cursor-pointer"
                >
                  Sim, esvaziar
                </button>
              </div>
            </div>
          )}

          {/* Conteúdo com rolagem (Lista de Itens ou Estado Vazio) */}
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 space-y-4">
            {validItems.length === 0 ? (
              /* Estado Vazio Humanizado com Dentinho */
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-5">
                <div className="relative w-36 h-36 rounded-3xl bg-mateus-sky-50 border-2 border-mateus-sky-200 p-4 flex items-center justify-center shadow-dentinho">
                  <img
                    src="/mascote/dentinho-carrinho.svg"
                    alt="Mascote Dentinho com cestinha vazia"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-mateus-red text-white flex items-center justify-center shadow-sm">
                    <ShoppingCart size={16} />
                  </div>
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-lg font-black text-mateus-blue-900">
                    Sua cesta ainda está vazia!
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    O Seu Osvaldo já abasteceu os balcões de hortifrúti, padaria e açougue com produtos fresquinhos e preços justos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExploreShop}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mateus-blue hover:bg-mateus-blue-700 text-white font-black text-xs sm:text-sm shadow-soft transition transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={16} className="text-mateus-sky-300" />
                  <span>Explorar Ofertas do Balcão</span>
                </button>
              </div>
            ) : (
              /* Lista de Itens no Carrinho */
              <div className="space-y-3">
                {/* Dica do Dentinho no Carrinho */}
                <div className="p-3 rounded-xl bg-mateus-sky-50/70 border border-mateus-sky-200/60 flex items-center gap-2.5 text-xs text-mateus-blue-900 font-semibold">
                  <img
                    src="/mascote/dentinho-ola.svg"
                    alt="Dentinho"
                    className="w-7 h-7 object-contain shrink-0"
                  />
                  <span>
                    Seus itens estão separados no balcão com muito carinho pelo Seu Osvaldo!
                  </span>
                </div>

                <div className="divide-y divide-slate-100 space-y-3">
                  {validItems.map((item) => (
                    <CartItemRow
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rodapé do Drawer com Resumo Financeiro */}
          {validItems.length > 0 && (
            <div className="px-5 py-4 sm:px-6 bg-slate-50 border-t border-slate-200 shrink-0">
              <CartSummary
                subtotal={subtotal}
                totalItems={totalItems}
                userCaderninhoLimit={user?.caderninhoLimit}
                userName={user?.name}
                onCheckout={handleCheckout}
                onContinueShopping={closeCart}
                onClearCart={() => setShowClearConfirm(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

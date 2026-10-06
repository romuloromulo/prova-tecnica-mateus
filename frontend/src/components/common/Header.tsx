import React from 'react';
import { ShoppingCart, Search, User, Heart } from 'lucide-react';

interface HeaderProps {
  cartItemCount?: number;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  userName?: string | null;
  onSearchChange?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount = 0,
  onOpenCart,
  onOpenAuth,
  userName = null,
  onSearchChange,
}) => {
  return (
    <header className="bg-mateus-blue text-white shadow-soft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 group cursor-pointer">
              {/* Heart Badge Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center shadow-heart transform group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-mateus-red text-mateus-red animate-pulse [animation-duration:2s]" />
              </div>

              <div>
                <span className="block text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
                  MATEUS
                </span>
                <span className="block text-[11px] sm:text-xs font-semibold text-mateus-sky-100 tracking-wide">
                  Você no <strong className="text-white underline decoration-mateus-red decoration-2">Coração</strong> da Gente
                </span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="search"
                placeholder="O que você precisa hoje, vizinho? Ex: Arroz, Frutas, Leite..."
                onChange={(e) => onSearchChange?.(e.target.value)}
                aria-label="Buscar produtos no supermercado"
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-11 pr-4 py-2.5 rounded-full text-sm font-medium border-2 border-transparent focus:border-mateus-sky-500 focus:outline-none shadow-sm transition"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Actions: User Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Greeting / Login button */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-mateus-blue-700/60 hover:bg-mateus-blue-700 text-white transition text-xs sm:text-sm font-semibold border border-mateus-blue-500/40"
              title={userName ? `Logado como ${userName}` : 'Fazer login ou cadastrar'}
            >
              <div className="w-7 h-7 rounded-full bg-mateus-blue-800 flex items-center justify-center">
                <User size={16} className="text-mateus-sky-100" />
              </div>
              <div className="text-left hidden lg:block">
                <span className="block text-[10px] text-mateus-sky-100 font-normal leading-tight">
                  {userName ? 'Olá, cliente amigo' : 'Caderninho Digital'}
                </span>
                <span className="block font-bold leading-tight truncate max-w-[120px]">
                  {userName ? userName : 'Entrar / Cadastrar'}
                </span>
              </div>
            </button>

            {/* Shopping Cart button */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Carrinho de compras com ${cartItemCount} itens`}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white font-bold text-xs sm:text-sm shadow-heart transition transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cesta</span>
              {cartItemCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-mateus-red text-xs font-black shadow">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar produtos (ex: Café, Arroz)..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              aria-label="Buscar produtos no supermercado"
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2 rounded-full text-xs font-medium border focus:border-mateus-sky-500 focus:outline-none shadow-sm"
            />
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

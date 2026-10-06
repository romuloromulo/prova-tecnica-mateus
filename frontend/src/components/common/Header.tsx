import React, { useState } from 'react';
import { ShoppingCart, Search, User, Heart, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  cartItemCount?: number;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  userName?: string | null;
  caderninhoLimit?: number;
  onSearchChange?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount = 0,
  onOpenCart,
  onOpenAuth,
  onLogout,
  userName = null,
  caderninhoLimit,
  onSearchChange,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="bg-mateus-blue text-white shadow-soft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Brand Logo & Slogan */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2 group cursor-pointer">
              {/* Heart Badge Icon */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center shadow-heart transform group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-mateus-red text-mateus-red animate-pulse [animation-duration:2s]" />
              </div>

              <div>
                <span className="block text-lg sm:text-2xl font-black tracking-tight leading-none text-white">
                  MATEUS
                </span>
                <span className="block text-[10px] sm:text-xs font-semibold text-mateus-sky-100 tracking-wide">
                  Você no <strong className="text-white underline decoration-mateus-red decoration-2">Coração</strong> da Gente
                </span>
              </div>
            </div>
          </div>

          {/* Search bar (Desktop) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="search"
                placeholder="O que você precisa hoje, vizinho? Ex: Arroz, Café, Frutas..."
                onChange={(e) => onSearchChange?.(e.target.value)}
                aria-label="Buscar produtos no supermercado"
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-11 pr-4 py-2 rounded-full text-xs sm:text-sm font-medium border-2 border-transparent focus:border-mateus-sky-500 focus:outline-none shadow-sm transition"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Actions: User Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
            {/* User Greeting / Login button */}
            {userName ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-mateus-blue-700 hover:bg-mateus-blue-600 text-white transition text-xs font-semibold border border-mateus-blue-500/40"
                  aria-expanded={showUserDropdown}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-mateus-blue-800 flex items-center justify-center shrink-0">
                    <User size={14} className="text-mateus-sky-200" />
                  </div>
                  <div className="text-left hidden sm:block max-w-[110px]">
                    <span className="block text-[9px] text-mateus-sky-200 leading-tight">
                      Caderninho Digital
                    </span>
                    <span className="block font-bold leading-tight truncate">
                      {userName}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-mateus-sky-200 hidden sm:block" />
                </button>

                {/* Dropdown do usuário logado */}
                {showUserDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                      {caderninhoLimit !== undefined && (
                        <p className="text-[11px] text-emerald-600 font-extrabold mt-0.5">
                          Limite: R$ {caderninhoLimit.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onLogout?.()}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                    >
                      <LogOut size={14} />
                      <span>Sair do Caderninho</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-mateus-blue-700/80 hover:bg-mateus-blue-700 text-white transition text-xs font-semibold border border-mateus-blue-500/40"
                title="Fazer login ou cadastrar"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-mateus-blue-800 flex items-center justify-center shrink-0">
                  <User size={14} className="text-mateus-sky-200" />
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[9px] text-mateus-sky-200 leading-tight">
                    Caderninho
                  </span>
                  <span className="block font-bold leading-tight">
                    Entrar / Cadastrar
                  </span>
                </div>
              </button>
            )}

            {/* Shopping Cart button */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Cesta de compras com ${cartItemCount} itens`}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white font-extrabold text-xs sm:text-sm shadow-heart transition transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cesta</span>
              {cartItemCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 rounded-full bg-white text-mateus-red text-[11px] font-black shadow">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar produtos (ex: Café, Arroz)..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              aria-label="Buscar produtos no supermercado"
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-9 pr-4 py-2 rounded-full text-xs font-medium border focus:border-mateus-sky-500 focus:outline-none shadow-xs"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

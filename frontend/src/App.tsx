import React, { useState } from 'react';
import { A11yBar } from '@/components/common/A11yBar';
import { Header } from '@/components/common/Header';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { DentinhoTip, type DentinhoVariant } from '@/components/common/DentinhoTip';
import { AuthModal } from '@/components/auth/AuthModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CheckoutPage } from '@/components/checkout/CheckoutPage';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import type { ProductCategory } from '@/types/product';
import {
  Sparkles,
  Heart,
  ShoppingCart,
  UserCheck,
  BookOpen
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, isAuthenticated, simulateLoginAsDonaMarta, simulateLoginAsPedro, logout } = useAuthStore();
  const { isOpen, openCart, getTotalItems, getSubtotal } = useCartStore();

  const [currentView, setCurrentView] = useState<'store' | 'checkout'>('store');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeDentinhoPose, setActiveDentinhoPose] = useState<DentinhoVariant>('ola');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleOpenLogin = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  const handleFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Se o usuário estiver no Checkout, renderiza a Visão Dedicada de Supermercado
  if (currentView === 'checkout') {
    return (
      <div className="min-h-screen flex flex-col bg-mateus-surface text-slate-800 antialiased selection:bg-mateus-red selection:text-white">
        {/* Barra de Acessibilidade mantida para a Dona Marta */}
        <A11yBar />
        <CheckoutPage
          onBackToStore={() => {
            setCurrentView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-mateus-surface text-slate-800 antialiased selection:bg-mateus-red selection:text-white">
      {/* 1. Barra de Acessibilidade (Dona Marta) */}
      <A11yBar />

      {/* 2 & 3. Cabeçalho Principal + Categorias Fixos no Topo (Sticky) */}
      <div className="sticky top-0 z-40 shadow-soft">
        <Header
          cartItemCount={getTotalItems()}
          userName={user?.name}
          caderninhoLimit={user?.caderninhoLimit}
          onOpenAuth={handleOpenLogin}
          onOpenCart={openCart}
          onLogout={logout}
          onSearchChange={setSearchTerm}
        />
        <Navbar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat as ProductCategory | 'all');
            const catalogEl = document.getElementById('catalogo-produtos');
            if (catalogEl) {
              catalogEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>

      {/* Modal Lateral / Drawer Deslizante da Cesta (Fase 4) */}
      <CartDrawer
        onProceedToCheckout={() => {
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modal de Autenticação Humanizada (Fase 2) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          role="status"
          className="fixed top-20 sm:top-24 right-3 sm:right-4 z-50 bg-mateus-blue text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-heart flex items-center gap-2 text-xs sm:text-sm font-bold animate-bounce [animation-duration:1s]"
        >
          <Heart size={16} className="fill-mateus-red text-mateus-red shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Banner Hero: Tradição & Inovação */}
        <section
          aria-label="Apresentação do Supermercado Você no Coração da Gente"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mateus-blue-900 via-mateus-blue to-mateus-blue-800 text-white p-5 sm:p-8 lg:p-10 shadow-soft"
        >
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-mateus-sky-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-10 w-60 h-60 rounded-full bg-mateus-red/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[11px] sm:text-xs font-bold text-mateus-sky-100">
                <BookOpen size={13} className="text-mateus-sky-400" />
                <span>Tradição do Balcão de 1987 • Desafio Técnico 2026</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Do caderninho azul para a{' '}
                <span className="text-mateus-sky-300 underline decoration-mateus-red decoration-4">
                  palma da sua mão
                </span>
                .
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
                Em 1987, o Seu Osvaldo conhecia cada cliente pelo nome e anotava no caderninho azul de confiança.
                Hoje, transformamos esse mesmo carinho em uma experiência digital inclusiva e com alto conforto visual para a <strong>Dona Marta</strong> e agilidade para o <strong>Pedro</strong>.
              </p>

              {/* Botões de Ação & Personas para Avaliação */}
              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                {!isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenLogin}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white font-extrabold text-xs sm:text-sm shadow-heart transition transform hover:scale-105 active:scale-95"
                    >
                      <span>Acessar Caderninho Digital</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenRegister}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                    >
                      <span>Criar Conta Grátis</span>
                    </button>
                  </>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-mateus-blue-800/90 text-xs text-mateus-sky-100 border border-mateus-blue-600">
                    <Heart size={14} className="fill-mateus-red text-mateus-red" />
                    <span>
                      Conectado como <strong>{user?.name}</strong> • Limite Disponível: R$ {user?.caderninhoLimit?.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="w-full sm:w-auto flex items-center gap-2 pt-1 sm:pt-0">
                  <span className="text-[11px] text-slate-300 font-semibold">Simular Persona:</span>
                  <button
                    type="button"
                    onClick={simulateLoginAsDonaMarta}
                    title="Entrar diretamente como Dona Marta"
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      user?.id === 1
                        ? 'bg-amber-400 text-slate-900 ring-2 ring-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <UserCheck size={13} />
                    <span>Dona Marta</span>
                  </button>
                  <button
                    type="button"
                    onClick={simulateLoginAsPedro}
                    title="Entrar diretamente como Pedro"
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      user?.id === 2
                        ? 'bg-amber-400 text-slate-900 ring-2 ring-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <UserCheck size={13} />
                    <span>Pedro</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Destaque Mascote Dentinho no Banner */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => setActiveDentinhoPose('ola')}
                title="Clique para interagir com o Dentinho"
              >
                <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl bg-white/10 backdrop-blur-md p-3 sm:p-4 border border-white/20 shadow-dentinho flex items-center justify-center transform group-hover:scale-105 transition-all">
                  <img
                    src="/mascote/dentinho-ola.svg"
                    alt="Mascote Dentinho acenando"
                    className="w-full h-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <div className="mt-2.5 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-mateus-sky-500 text-white font-extrabold text-xs shadow">
                    Dentinho, o Castor Amigo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dica Amigável do Mascote Dentinho */}
        <section aria-label="Dica do Mascote Dentinho" className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-mateus-blue text-xs font-black uppercase tracking-wider">
              <Sparkles size={14} className="text-mateus-sky-500" />
              <span>Dica do Dentinho</span>
            </div>

            {/* Seletor rápido de poses */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {(['ola', 'carrinho', 'sucesso'] as DentinhoVariant[]).map((pose) => (
                <button
                  key={pose}
                  type="button"
                  onClick={() => setActiveDentinhoPose(pose)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition ${
                    activeDentinhoPose === pose
                      ? 'bg-mateus-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-mateus-blue hover:bg-slate-50'
                  }`}
                >
                  {pose === 'ola' ? '👋 Olá' : pose === 'carrinho' ? '🛒 Cesta' : '🎉 Dica'}
                </button>
              ))}
            </div>
          </div>

          {/* Componente DentinhoTip */}
          <DentinhoTip
            variant={activeDentinhoPose}
            message={
              activeDentinhoPose === 'ola'
                ? user?.id === 1
                  ? 'Dona Marta, que alegria ter a senhora aqui! Pode navegar com calma, usar os botões A+ e A- para o tamanho ideal das letras e qualquer dúvida nossa equipe atende pelo 0800!'
                  : user?.id === 2
                  ? 'E aí, Pedro! Já ativou o login rápido? Catálogo leve, busca ágil e ofertas com entrega rápida para você não perder tempo entre as aulas!'
                  : 'Olá! Sou o Dentinho, o castor de pelúcia mascote do Grupo Mateus desde os anos 90. Estou aqui para ajudar em cada passo da sua compra com muito carinho!'
                : activeDentinhoPose === 'carrinho'
                ? 'Dica amiga: adicionando produtos de hortifrúti ou mercearia, você economiza na feira da semana com os preços do Seu Osvaldo!'
                : 'Parabéns pela escolha! Nossos produtos saem fresquinhos da horta e da padaria direto para sua casa.'
            }
            actionText={!isAuthenticated ? 'Abrir meu Caderninho agora' : undefined}
            onAction={!isAuthenticated ? handleOpenRegister : undefined}
          />
        </section>

        {/* FASE 3: Catálogo Dinâmico por Setores com Paginação e Busca (Sem abas duplicadas) */}
        <ProductGrid
          selectedCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
          onAddedFeedback={handleFeedback}
        />

      </main>

      {/* Botão Flutuante Rápido da Cesta (Acesso instantâneo em qualquer ponto da página) */}
      {getTotalItems() > 0 && !isOpen && (
        <aside
          aria-label="Acesso rápido à cesta de compras"
          className="fixed bottom-5 right-4 sm:right-6 z-30 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir cesta com ${getTotalItems()} itens no valor de R$ ${getSubtotal().toFixed(2).replace('.', ',')}`}
            className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-full bg-mateus-red hover:bg-mateus-red-hover text-white font-black text-xs sm:text-sm shadow-2xl border-2 border-white transform hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-mateus-red text-[10px] font-black flex items-center justify-center shadow">
                {getTotalItems()}
              </span>
            </div>
            <span>Ver Cesta • R$ {getSubtotal().toFixed(2).replace('.', ',')}</span>
          </button>
        </aside>
      )}

      {/* 5. Rodapé com Tradição e Suporte Humanizado */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;

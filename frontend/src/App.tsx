import React, { useState } from 'react';
import { A11yBar } from '@/components/common/A11yBar';
import { Header } from '@/components/common/Header';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { DentinhoTip, type DentinhoVariant } from '@/components/common/DentinhoTip';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';
import {
  Sparkles,
  Heart,
  Plus,
  Trash2,
  ShoppingBag,
  UserCheck,
  BookOpen
} from 'lucide-react';

// Amostra de produtos para testar integração
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Café Tradicional do Seu Osvaldo 500g',
    description: 'Torrado e moído na hora, sabor inconfundível do balcão de 1987.',
    price: 18.9,
    stockQuantity: 12,
    category: 'mercearia',
    unit: 'pct',
    isPromotion: true,
  },
  {
    id: 2,
    name: 'Maçã Fuji Selecionada (Kg)',
    description: 'Docinhas e crocantes, colhidas frescas no hortifrúti.',
    price: 9.49,
    stockQuantity: 25,
    category: 'hortifruti',
    unit: 'kg',
  },
  {
    id: 3,
    name: 'Pão Francês Tradicional (Cesta 6 un)',
    description: 'Quentinho e crocante, saindo do forno a toda hora na padaria.',
    price: 7.2,
    stockQuantity: 8,
    category: 'padaria',
    unit: 'un',
  },
];

export const App: React.FC = () => {
  const { user, isAuthenticated, simulateLoginAsDonaMarta, simulateLoginAsPedro, logout } = useAuthStore();
  const { items, addItem, removeItem, updateQuantity, getTotalItems, getSubtotal } = useCartStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDentinhoPose, setActiveDentinhoPose] = useState<DentinhoVariant>('ola');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleAddToCart = (product: Product) => {
    const res = addItem(product, 1);
    if (!res.success && res.message) {
      setFeedbackMsg(res.message);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      setFeedbackMsg(`✓ ${product.name} adicionado à cesta!`);
      setTimeout(() => setFeedbackMsg(null), 2500);
    }
  };

  const handleOpenLogin = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-mateus-surface text-slate-800 antialiased selection:bg-mateus-red selection:text-white">
      {/* 1. Barra de Acessibilidade (Dona Marta) */}
      <A11yBar />

      {/* 2. Cabeçalho Principal com Logo Mateus & Ações */}
      <Header
        cartItemCount={getTotalItems()}
        userName={user?.name}
        caderninhoLimit={user?.caderninhoLimit}
        onOpenAuth={handleOpenLogin}
        onLogout={logout}
      />

      {/* 3. Barra de Categorias */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
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

        {/* Seção Mascote Dentinho & Guia Amigável */}
        <section aria-labelledby="dentinho-section-title" className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-mateus-blue text-xs font-extrabold uppercase tracking-wider">
                <Sparkles size={14} className="text-mateus-sky-500" />
                <span>Mascote Oficial Grupo Mateus</span>
              </div>
              <h2 id="dentinho-section-title" className="text-xl sm:text-2xl font-black text-mateus-blue-900">
                Dentinho, seu guia do balcão para a era digital
              </h2>
            </div>

            {/* Seletor de poses */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              {(['ola', 'carrinho', 'sucesso'] as DentinhoVariant[]).map((pose) => (
                <button
                  key={pose}
                  type="button"
                  onClick={() => setActiveDentinhoPose(pose)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition ${
                    activeDentinhoPose === pose
                      ? 'bg-mateus-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-mateus-blue hover:bg-slate-50'
                  }`}
                >
                  {pose === 'ola' ? '👋 Olá' : pose === 'carrinho' ? '🛒 No Carrinho' : '🎉 Sucesso'}
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

        {/* Vitrine de Demonstração de Produtos */}
        <section aria-labelledby="catalog-preview-title" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-mateus-red text-xs font-extrabold uppercase tracking-wider">
                <Heart size={14} className="fill-mateus-red text-mateus-red" />
                <span>Ofertas Selecionadas</span>
              </div>
              <h2 id="catalog-preview-title" className="text-xl sm:text-2xl font-black text-mateus-blue-900">
                Itens em Destaque no Supermercado
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SAMPLE_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-mateus-sky-50 text-mateus-sky-600 border border-mateus-sky-200">
                      {prod.category}
                    </span>
                    {prod.isPromotion && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-mateus-red-50 text-mateus-red border border-mateus-red-100 flex items-center gap-1">
                        <Heart size={10} className="fill-mateus-red" /> Oferta do Seu Osvaldo
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block">Preço</span>
                    <span className="text-lg sm:text-xl font-black text-mateus-blue">
                      R$ {prod.price.toFixed(2)}
                      <small className="text-xs text-slate-400 font-normal"> /{prod.unit}</small>
                    </span>
                    <span className="block text-[11px] text-emerald-600 font-semibold">
                      {prod.stockQuantity} un disponíveis
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white text-xs font-extrabold shadow-heart transition active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resumo da Cesta Atual (Zustand Store) */}
        {items.length > 0 && (
          <section
            aria-label="Resumo da Cesta Atual"
            className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-mateus-sky-200 shadow-dentinho"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 font-black text-base sm:text-lg text-mateus-blue">
                <ShoppingBag className="text-mateus-red" />
                <span>Sua Cesta Atual ({getTotalItems()} itens)</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-mateus-blue">
                Total: R$ {getSubtotal().toFixed(2)}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-2.5 sm:py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">{product.name}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">
                      R$ {product.price.toFixed(2)} cada • Subtotal: R$ {(product.price * quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Diminuir quantidade"
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs sm:text-sm font-extrabold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Aumentar quantidade"
                      className="w-7 h-7 rounded-lg bg-mateus-blue text-white font-bold flex items-center justify-center transition hover:bg-mateus-blue-700"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="p-1.5 text-slate-400 hover:text-mateus-red transition ml-1"
                      title="Remover produto da cesta"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 5. Rodapé com Tradição e Suporte Humanizado */}
      <Footer />
    </div>
  );
};

export default App;

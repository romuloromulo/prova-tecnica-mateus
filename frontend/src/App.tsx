import React, { useState } from 'react';
import { A11yBar } from '@/components/common/A11yBar';
import { Header } from '@/components/common/Header';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { DentinhoTip, type DentinhoVariant } from '@/components/common/DentinhoTip';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';
import {
  Sparkles,
  Heart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  ShoppingBag,
  Palette,
  ShieldCheck,
  UserCheck,
  BookOpen
} from 'lucide-react';

// Amostra de produtos para testar integração do carrinho e tokens na Fase 1
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

  return (
    <div className="min-h-screen flex flex-col bg-mateus-surface text-slate-800">
      {/* 1. Barra de Acessibilidade (Dona Marta) */}
      <A11yBar />

      {/* 2. Cabeçalho Principal com Logo Mateus & Slogan */}
      <Header
        cartItemCount={getTotalItems()}
        userName={user?.name}
        onOpenAuth={simulateLoginAsDonaMarta}
      />

      {/* 3. Barra de Categorias */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="fixed top-24 right-4 z-50 bg-mateus-blue text-white px-5 py-3 rounded-2xl shadow-heart flex items-center gap-2 text-sm font-bold animate-bounce [animation-duration:1s]">
          <Heart size={18} className="fill-mateus-red text-mateus-red" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-10">
        {/* Banner Hero: Tradição & Inovação */}
        <section
          aria-label="Apresentação do Supermercado Você no Coração da Gente"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mateus-blue-900 via-mateus-blue to-mateus-blue-800 text-white p-6 sm:p-10 shadow-soft"
        >
          {/* Fundo decorativo sutil */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-mateus-sky-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-10 w-60 h-60 rounded-full bg-mateus-red/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold text-mateus-sky-100">
                <BookOpen size={14} className="text-mateus-sky-400" />
                <span>Tradição do Balcão de 1987 • Desafio Técnico 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Do caderninho azul para a{' '}
                <span className="text-mateus-sky-400 underline decoration-mateus-red decoration-4">
                  palma da sua mão
                </span>
                .
              </h1>

              <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                Em 1987, o Seu Osvaldo conhecia cada cliente pelo nome e anotava no caderninho azul de confiança.
                Hoje, transformamos esse mesmo carinho em uma experiência digital rápida, inclusiva e com alto conforto de leitura para todas as idades.
              </p>

              {/* Botões de Simulação de Personas para Avaliação */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-300 w-full sm:w-auto">
                  Testar Personas:
                </span>

                <button
                  type="button"
                  onClick={simulateLoginAsDonaMarta}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                    user?.id === 1
                      ? 'bg-mateus-red text-white ring-2 ring-white shadow-heart'
                      : 'bg-white text-mateus-blue hover:bg-mateus-sky-50'
                  }`}
                >
                  <UserCheck size={16} />
                  <span>Dona Marta (72 anos)</span>
                </button>

                <button
                  type="button"
                  onClick={simulateLoginAsPedro}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                    user?.id === 2
                      ? 'bg-mateus-red text-white ring-2 ring-white shadow-heart'
                      : 'bg-white text-mateus-blue hover:bg-mateus-sky-50'
                  }`}
                >
                  <UserCheck size={16} />
                  <span>Pedro (Neto Universitário)</span>
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={logout}
                    className="text-xs font-semibold text-slate-300 hover:text-white underline underline-offset-4 px-2 py-1"
                  >
                    Desconectar
                  </button>
                )}
              </div>

              {/* Status do Usuário Logado */}
              {user && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-mateus-blue-800/90 text-xs text-mateus-sky-100 border border-mateus-blue-600">
                  <Heart size={14} className="fill-mateus-red text-mateus-red" />
                  <span>
                    Conectado como <strong>{user.name}</strong> • Limite no Caderninho Digital: R$ {user.caderninhoLimit?.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Destaque Mascote Dentinho no Banner */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative group cursor-pointer" onClick={() => setActiveDentinhoPose('ola')}>
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-white/10 backdrop-blur-md p-4 border border-white/20 shadow-dentinho flex items-center justify-center transform group-hover:scale-105 transition-all">
                  <img
                    src="/mascote/dentinho-ola.svg"
                    alt="Mascote Dentinho acenando"
                    className="w-full h-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-mateus-sky-500 text-white font-extrabold text-xs shadow">
                    Dentinho, o Castor Amigo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 1: Mascote Dentinho & Guia Amigável (Requisito Fase 1) */}
        <section aria-labelledby="dentinho-section-title" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-mateus-blue text-xs font-extrabold uppercase tracking-wider">
                <Sparkles size={16} className="text-mateus-sky-500" />
                <span>Mascote Oficial Grupo Mateus</span>
              </div>
              <h2 id="dentinho-section-title" className="text-2xl font-black text-mateus-blue-900">
                Dentinho, seu guia do balcão para a era digital
              </h2>
            </div>

            {/* Seletor interativo de poses do mascote */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
              {(['ola', 'carrinho', 'sucesso'] as DentinhoVariant[]).map((pose) => (
                <button
                  key={pose}
                  type="button"
                  onClick={() => setActiveDentinhoPose(pose)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
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

          {/* Componente DentinhoTip dinâmico */}
          <DentinhoTip
            variant={activeDentinhoPose}
            message={
              activeDentinhoPose === 'ola'
                ? user?.id === 1
                  ? 'Dona Marta, fique bem tranquila! Todas as letras estão grandes e fáceis de ler. Se precisar de ajuda, o Seu Osvaldo deixou tudo anotado!'
                  : user?.id === 2
                  ? 'E aí, Pedro! Produtos fresquinhos com busca rápida e checkout num instante pelo celular!'
                  : 'Olá! Sou o Dentinho, o castor mascote do Grupo Mateus desde os anos 90. Estou aqui para guiar você em cada passo da sua compra com muito carinho!'
                : activeDentinhoPose === 'carrinho'
                ? 'Olha a dica de economia: adicionando mais itens da cesta básica, você garante descontos especiais e frete amigo na sua entrega!'
                : 'Parabéns pela escolha! O Grupo Mateus garante qualidade selecionada a dedo em cada item da sua cesta.'
            }
            actionText="Ver mais sobre nossa história"
            onAction={() => alert('Em 1987 nasceu o caderninho do Seu Osvaldo com os valores de confiança, respeito e preço justo!')}
          />
        </section>

        {/* Seção 2: Vitrine de Teste da Cesta de Compras & Tokens */}
        <section aria-labelledby="catalog-preview-title" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-mateus-red text-xs font-extrabold uppercase tracking-wider">
                <Heart size={16} className="fill-mateus-red text-mateus-red" />
                <span>Ofertas Selecionadas</span>
              </div>
              <h2 id="catalog-preview-title" className="text-2xl font-black text-mateus-blue-900">
                Itens de Exemplo para Teste de Interação
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-mateus-sky-50 text-mateus-sky-600 border border-mateus-sky-200">
                      {prod.category}
                    </span>
                    {prod.isPromotion && (
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-mateus-red-50 text-mateus-red border border-mateus-red-100 flex items-center gap-1">
                        <Heart size={10} className="fill-mateus-red" /> Oferta do Seu Osvaldo
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-800 leading-snug">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Preço</span>
                    <span className="text-xl font-black text-mateus-blue">
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
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white text-xs font-extrabold shadow-heart transition active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção 3: Resumo Dinâmico do Carrinho (Zustand Store Test) */}
        {items.length > 0 && (
          <section
            aria-label="Resumo da Cesta Atual"
            className="bg-white rounded-2xl p-6 border-2 border-mateus-sky-200 shadow-dentinho"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-black text-lg text-mateus-blue">
                <ShoppingBag className="text-mateus-red" />
                <span>Sua Cesta Atual ({getTotalItems()} itens)</span>
              </div>
              <span className="text-xl font-black text-mateus-blue">
                Total: R$ {getSubtotal().toFixed(2)}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      R$ {product.price.toFixed(2)} cada • Subtotal: R$ {(product.price * quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-extrabold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-mateus-blue text-white font-bold flex items-center justify-center transition hover:bg-mateus-blue-700"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="p-1.5 text-slate-400 hover:text-mateus-red transition ml-2"
                      title="Remover produto da cesta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Seção 4: Inspeção Visual de Design Tokens (Grupo Mateus) */}
        <section aria-labelledby="tokens-title" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-mateus-blue" />
            <h2 id="tokens-title" className="text-lg font-black text-mateus-blue-900">
              Tokens de Design do Grupo Mateus (Fase 1 Concluída)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-mateus-blue text-white shadow-soft text-center">
              <span className="block text-xs font-bold uppercase tracking-wider">Azul Royal</span>
              <span className="block text-sm font-black mt-1">#003893</span>
              <span className="text-[10px] text-mateus-sky-100">Estrutura & Confiança</span>
            </div>

            <div className="p-3 rounded-xl bg-mateus-red text-white shadow-heart text-center">
              <span className="block text-xs font-bold uppercase tracking-wider">Vermelho Coração</span>
              <span className="block text-sm font-black mt-1">#E31826</span>
              <span className="text-[10px] text-red-100">CTA & Selo de Afeto</span>
            </div>

            <div className="p-3 rounded-xl bg-mateus-sky-500 text-white text-center">
              <span className="block text-xs font-bold uppercase tracking-wider">Azul Celeste</span>
              <span className="block text-sm font-black mt-1">#009EE3</span>
              <span className="text-[10px] text-sky-100">Acentos & Dentinho</span>
            </div>

            <div className="p-3 rounded-xl bg-mateus-surface border border-slate-200 text-slate-800 text-center">
              <span className="block text-xs font-bold uppercase tracking-wider">Superfície</span>
              <span className="block text-sm font-black mt-1">#F8FAFC</span>
              <span className="text-[10px] text-slate-500">Conforto Dona Marta</span>
            </div>

            <div className="p-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 text-center">
              <span className="block text-xs font-bold uppercase tracking-wider">Branco Puro</span>
              <span className="block text-sm font-black mt-1">#FFFFFF</span>
              <span className="text-[10px] text-slate-500">Cards e Modais</span>
            </div>
          </div>

          {/* Estados Semânticos */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="text-slate-500">Estados Semânticos:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={14} /> Sucesso (#10B981)
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle size={14} /> Alerta de Estoque (#F59E0B)
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              <XCircle size={14} /> Erro / Recusado (#EF4444)
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 ml-auto">
              <ShieldCheck size={14} /> WCAG 2.1 AA Compliant
            </span>
          </div>
        </section>
      </main>

      {/* 5. Rodapé com Tradição e Suporte Humanizado */}
      <Footer />
    </div>
  );
};

export default App;

# Plano de Implementação — Front-end do E-commerce
## Supermercado "Você no Coração da Gente"
**Desafio Técnico 2026 | Foco: Front-end (Parte I com IA)**

---

## 1. Visão Geral e Conceito do Negócio

* **Slogan & Missão:** *"Do balcão da esquina para a palma da mão do cliente"* — levar o carinho e a proximidade do lendário caderninho de capa azul de 1987 do Seu Osvaldo para uma experiência digital intuitiva.
* **Personas Principais:**
  * **Dona Marta (72 anos):** Cliente tradicional. Precisa de contraste alto, textos legíveis, botões grandes e claros, sem jargões técnicos frios.
  * **Pedro (Neto universitário):** Compra rápida pelo celular, busca ágil, catálogo fluido e checkout descomplicado.
* **Mascote da Marca:** **Dentinho** (o castor de pelúcia mascote desde os anos 90), atuando como guia amigável e indicador de status na interface.

---

## 2. Decisões Arquiteturais e Justificativas Técnicas

### 2.1. Framework do Front-end: Vite + React (TypeScript)
* **Por que Vite e não Next.js:**
  * **Isolamento de Responsabilidade:** O Spring Boot 3 é a única autoridade de backend da solução. O front-end atua como uma SPA pura, sem overhead de um servidor Node intermediário (BFF).
  * **Docker Compose Leve e Instantâneo:** O build final estático é servido por uma imagem `nginx:alpine` (~25MB), iniciando em 1 segundo e consumindo menos de 30MB de memória RAM.
  * **Pragmatismo & DX:** Hot Module Replacement (HMR) ultrarrápido sem complexidades de divisão Server vs. Client Components (`'use client'`).

### 2.2. Autenticação: JWT Stateless Próprio (Spring Security)
* **Por que JWT próprio e não Keycloak / Provedor em Nuvem:**
  * **Zero Dependências Pesadas:** Não requer container extra de SSO (o Keycloak demandaria 1GB+ de RAM e 40s para subir no Docker Compose).
  * **Domínio de Produção:** Tecnologia já dominada e utilizada em projetos de produção pelo desenvolvedor, garantindo controle total sobre o ciclo de vida do token, cabeçalhos e segurança.
  * **Escalabilidade Stateless:** A API Spring Boot valida a assinatura criptográfica sem necessidade de persistir sessões em memória ou Redis.

---

## 3. Identidade Visual (Design Tokens — Grupo Mateus)

* **Azul Royal Principal:** `#003893` (barra superior, cabeçalho e estrutura corporativa).
* **Vermelho Coração:** `#E31826` (o icônico selo do coração "Você no Coração da Gente", botões de CTA primários, carrinho e selos de destaque).
* **Azul Celeste / Turquesa:** `#009EE3` (acentos interativos, destaques de navegação e do mascote Dentinho).
* **Superfície / Fundo:** `#F8FAFC` (fundo limpo com alto conforto visual para a Dona Marta).
* **Branco Puro:** `#FFFFFF` (cards de produtos, modais e formulários com sombras suaves).
* **Estados Semânticos:**
  * Sucesso / Aprovado: `#10B981`
  * Alerta de Estoque: `#F59E0B`
  * Erro / Recusado: `#EF4444`

---

## 4. Estrutura de Arquivos Planejada

```text
frontend/
├── public/
│   ├── favicon.ico
│   └── mascote/
│       ├── dentinho-ola.svg
│       ├── dentinho-carrinho.svg
│       └── dentinho-sucesso.svg
├── src/
│   ├── assets/
│   │   └── styles/globals.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx           # Boas-vindas personalizadas, busca e acesso rápido
│   │   │   ├── Navbar.tsx           # Categorias (Hortifrúti, Açougue, Padaria, Mercearia, Limpeza)
│   │   │   ├── Footer.tsx           # História do Seu Osvaldo e mascote Dentinho
│   │   │   ├── A11yBar.tsx          # Controles de acessibilidade (Zoom de fonte e Alto Contraste)
│   │   │   └── DentinhoTip.tsx      # Balãozinho amigável do mascote
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx        # Login com tratamento amigável de erro
│   │   │   └── RegisterForm.tsx     # Formulário de cadastro com validações Zod
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx      # Preço BRL, categoria, badge de estoque e botão de ação
│   │   │   ├── ProductGrid.tsx      # Grade responsiva com skeletons
│   │   │   ├── CategoryTabs.tsx     # Filtro por abas de categorias
│   │   │   ├── SearchInput.tsx      # Campo de busca debounced
│   │   │   └── PaginationBar.tsx    # Controle de paginação
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx       # Visualização rápida do carrinho
│   │   │   ├── CartItemRow.tsx      # Incrementador +/- limitado ao estoque
│   │   │   └── CartSummary.tsx      # Subtotal e avanço para checkout
│   │   └── checkout/
│   │       ├── PaymentSimulator.tsx # Simulador de pagamento (Aprovar / Recusar)
│   │       ├── OrderStatusBadge.tsx # Status dinâmico (Pendente -> Aprovado / Recusado)
│   │       └── OrderSuccessModal.tsx# Confirmação e resumo do pedido
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useA11y.ts
│   ├── services/
│   │   ├── api.ts                   # Axios com interceptor de Bearer Token JWT
│   │   ├── authService.ts           # Endpoints de login e cadastro
│   │   ├── productService.ts        # Endpoints de listagem paginada e filtros
│   │   ├── cartService.ts           # Endpoints de carrinho sincronizado
│   │   └── orderService.ts          # Endpoints de checkout e status
│   ├── store/
│   │   ├── authStore.ts             # Zustand para autenticação
│   │   └── cartStore.ts             # Zustand para carrinho
│   ├── types/
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   ├── routes/
│   │   └── AppRoutes.tsx            # Rotas públicas e protegidas
│   ├── App.tsx
│   └── main.tsx
├── nginx.conf                       # Proxy reverso para /api e fallback SPA
├── Dockerfile                       # Multi-stage build (Node build + Nginx alpine)
├── package.json
└── tailwind.config.ts
```

---

## 5. Fases de Execução do Front-end

1. **Fase 1: Configuração do Projeto e Design Tokens**
   * Setup do Vite + React + TypeScript + Tailwind CSS.
   * Configuração das cores (azul, turquesa), fontes legíveis e suporte a A11y.
   * Criação do componente do mascote Dentinho.

2. **Fase 2: Autenticação & Cadastro Humanizado (Requisito IA)**
   * Telas de Login e Cadastro de Usuário.
   * Validações em tempo real com Zod (mensagens acolhedoras para a Dona Marta).
   * Interceptor do Axios com injeção automática de `Authorization: Bearer <token>`.
   * Registro do relatório de IA (prompts e refinamentos).

3. **Fase 3: Catálogo de Produtos e Filtros**
   * Consumo da API de listagem paginada.
   * Filtro por categorias (*Hortifrúti, Açougue, Padaria, Mercearia, Limpeza*).
   * Busca com debounce por nome.
   * Badges visuais de estoque disponível.

4. **Fase 4: Carrinho de Compras**
   * Adicionar, remover e alterar quantidades.
   * Validação de limites com base no estoque retornado.
   * Sincronização entre estado local e API para usuário autenticado.

5. **Fase 5: Checkout e Simulador de Pagamento**
   * Resumo de itens e total.
   * Gateway fake simulado com transições de estado: *Pendente ➔ Aprovado / Recusado*.
   * Feedback claro de baixa de estoque e consulta de pedido.

6. **Fase 6: Dockerfile & Documentação de IA (Seção 3.2)**
   * Criação do container Nginx para o Docker Compose.
   * Geração do arquivo `docs/relatorio-ia.md` com todo o histórico do processo de IA.

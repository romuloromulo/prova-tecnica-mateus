# Supermercado "Você no Coração da Gente" — Desafio Técnico 2026
> *"Do balcão da esquina para a palma da mão do cliente"*

Aplicação de E-commerce desenvolvida para o Grupo Mateus, inspirada na história de 1987 do lendário caderninho azul do Seu Osvaldo e no mascote **Dentinho** (o castor de pelúcia mascote desde os anos 90).

---

## 🏛️ Arquitetura e Decisões Técnicas

* **Front-end:** Vite 6 + React 19 + TypeScript + Tailwind CSS v3.4
  * **SPA Pura:** Comunicação direta com a API RESTful sem intermediário BFF.
  * **Design System Institucional (Grupo Mateus):**
    * Azul Royal Principal (`#003893`)
    * Vermelho Coração (`#E31826`)
    * Azul Celeste / Turquesa (`#009EE3`)
    * Superfície Confortável (`#F8FAFC`)
  * **Acessibilidade WCAG 2.1 AA (Persona Dona Marta, 72 anos):**
    * Barra superior [`A11yBar`](file:///frontend/src/components/common/A11yBar.tsx) com ampliação de texto (`A-`, `Padrão`, `A+`) e modo de alto contraste.
    * Alvos de clique confortáveis (mínimo 44x44px) e alto contraste cromático.
  * **Mascote Dentinho:**
    * 3 poses exclusivas em SVG (`dentinho-ola.svg`, `dentinho-carrinho.svg`, `dentinho-sucesso.svg`).
    * Balão interativo de dicas [`DentinhoTip`](file:///frontend/src/components/common/DentinhoTip.tsx).
  * **Gerenciamento de Estado:** Zustand para autenticação (`authStore`) e cesta de compras (`cartStore`).
* **Documentação com IA (Seção 3.2):**
  * Histórico detalhado de prompts, correções e senso crítico registrado em [`docs/relatorio-ia.md`](file:///docs/relatorio-ia.md).

---

## 📁 Estrutura de Pastas

```text
├── docs/
│   ├── plano-implementacao-frontend.md   # Plano completo das 6 fases
│   └── relatorio-ia.md                   # Relatório de IA (Seção 3.2)
├── frontend/
│   ├── public/
│   │   └── mascote/                      # SVGs do mascote Dentinho
│   ├── src/
│   │   ├── assets/styles/globals.css     # Design tokens e temas A11y
│   │   ├── components/common/            # Header, Navbar, Footer, A11yBar, DentinhoTip
│   │   ├── hooks/                        # useA11y
│   │   ├── services/                     # Axios API com interceptor JWT
│   │   ├── store/                        # Zustand (authStore, cartStore)
│   │   ├── types/                        # Contratos TypeScript (User, Product, Cart, Order)
│   │   ├── App.tsx                       # Interface interativa da Fase 1
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Como Executar o Front-end

### Pré-requisitos
* Node.js 20+
* npm 10+

### Passo a Passo

1. **Acessar a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em: `http://localhost:3000` (ou porta indicada no terminal).

4. **Executar build de produção:**
   ```bash
   npm run build
   ```
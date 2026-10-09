# Relatório do Processo com Inteligência Artificial (Seção 3.2)
## Supermercado "Você no Coração da Gente"

---

## 1. LLM Utilizada
* **Modelo e Versão:** Google Gemini 2.5 Flash / Gemini 2.5 Pro (via Antigravity AI Agentic Coding).
* **Parâmetros:** Contexto estendido com leitura direta do edital oficial da prova em PDF.

## 2. Ferramentas e Ambientes Utilizados
* **Ambiente de Desenvolvimento:** Antigravity Agentic IDE (DeepMind / Google).
* **Terminal & Shell:** PowerShell / Windows 11.
* **Build Tool:** Vite 6 / React 19 / TypeScript / Tailwind CSS.
* **Controle de Versão:** Git / GitHub.

## 3. Plugins, Extensões, MCPs e Skills Empregados
* **`brand-design-system`:** Skill customizada para garantir identidade visual (azul `#0F3C6E`, turquesa `#00B4D8`), presença acolhedora do mascote **Dentinho** e ergonomia para a persona da **Dona Marta** (72 anos).
* **`ai-process-documenter`:** Skill para registro em tempo real de decisões, prompts, correções e senso crítico.
* **`a11y-debugging` / `modern-web-guidance`:** Validação de padrões WCAG 2.1 AA (contraste, navegação por teclado, alvos de toque, ARIA labels).

## 4. Prompts Relevantes & Estratégia de Prompting
* **Estratégia de Contexto Rico:**
  * O edital original da prova técnica foi fornecido na íntegra para a IA compreender não apenas a parte técnica, mas a história de 1987 do Seu Osvaldo e a proposta de valor do "caderninho digital".
* **Prompt de Definição de Arquitetura:**
  * Solicitação de estudo detalhado do edital, comparação entre Vite e Next.js e análise de viabilidade de autenticação própria por JWT vs. SSO externo.

## 5. O que a IA Gerou vs. O que Foi Decidido e Ajustado Manualmente
* **Decisão Arquitetural do Desenvolvedor (Senso Crítico):**
  * **Vite vs. Next.js:** O desenvolvedor avaliou a simplicidade operacional do Docker Compose e optou por Vite (React SPA) servido via Nginx, evitando redundância de servidor Node.js intermediário com o Spring Boot 3.
  * **JWT Stateless:** O desenvolvedor optou por JWT próprio no Spring Security com base em sua experiência e domínio em projetos de produção, reduzindo peso de container e garantindo independência de serviços externos.
  * **Refinamento de Identidade Visual (Senso Crítico):** Enquanto a IA propôs inicialmente uma paleta genérica baseada apenas no texto do edital, o desenvolvedor forneceu o logo real do Grupo Mateus e refinou as cores institucionais (Azul Royal `#003893`, Vermelho Coração `#E31826` e Celeste `#009EE3`). Isso trouxe autenticidade e conexão direta com a história de 1987 do Seu Osvaldo e o slogan "Você no Coração da Gente".
* **Geração pela IA:**
  * Estruturação de pastas, especificações de componentes e skills de governança.

## 6. Problemas Encontrados & Como Foram Corrigidos
* **Fase 1 — Setup do Frontend & Estabilização de Ambiente:**
  * **Problema com Vite 8 (Rolldown Alpha) no Node.js v20.12 (Windows):** Ao rodar o gerador padrão `create-vite`, o template configurou o Vite 8 com dependência nativa experimental do Rolldown que falhou no ambiente Windows (`Cannot find native binding`).
  * **Ação Corretiva do Desenvolvedor:** O desenvolvedor interveio e fixou o `vite@^6.2.0` com `@vitejs/plugin-react@^4.3.4`, garantindo build de produção 100% estável e compatível com as versões LTS.
  * **Problema com TypeScript 6 (`baseUrl` e `verbatimModuleSyntax`):** O TypeScript 6 apontou depreciação do parâmetro `baseUrl` no `tsconfig.app.json` e exigiu uso estrito de imports de tipos (`import type { ... }`).
  * **Ação Corretiva do Desenvolvedor:** O `tsconfig.app.json` foi modernizado para remover `baseUrl` mantendo `paths: { "@/*": ["./src/*"] }` e os imports de contratos (`Product`, `CartItem`, `DentinhoVariant`, `User`) foram ajustados para a sintaxe `import type`.
  * **Design & Acessibilidade WCAG 2.1 AA (Persona Dona Marta):** A IA gerou a barra de acessibilidade `A11yBar` e o hook `useA11y` permitindo controle granular do tamanho de fonte (`A-`, `Padrão`, `A+`) e modo de alto contraste para atender aos requisitos de visão e contraste da Dona Marta.
* **Fase 2 — Autenticação & Cadastro Humanizado (Requisito IA):**
  * **Remoção de Elementos de Debug:** O painel de demonstração de tokens visuais utilizado na Fase 1 foi removido da tela principal a pedido do desenvolvedor, tornando a aplicação 100% voltada ao consumidor final.
  * **Validação Humanizada com Zod:** Em vez de mensagens genéricas em inglês (como *"Invalid email"* ou *"Too short"*), foram construídos schemas em Zod com linguagem afetuosa e didática, facilitando o entendimento de usuários idosos como a Dona Marta e eliminando atritos de formulário.
  * **Modal de Autenticação com Abas e Acessibilidade:** Implementação de `AuthModal.tsx` com trap de teclado (ESC para fechar), bloqueio de scroll no body e abas integradas para Login e Cadastro.
  * **Resiliência e Desacoplamento:** Criação do `authService.ts` com fallback inteligente local enquanto a API Spring Boot do backend é desenvolvida, permitindo validação contínua da interface.
* **Fase 3 — Catálogo de Produtos, Filtros por Setor e Paginação:**
  * **Transição Fluida entre Setores:** Criação do `ProductGrid.tsx` e `CategoryTabs.tsx` com contagem em tempo real de produtos por setor (*Hortifrúti, Açougue, Padaria, Mercearia, Limpeza*). Ao alternar o setor, o catálogo filtra instantaneamente os produtos e atualiza o cabeçalho descritivo.
  * **Busca Otimizada com Debounce:** Implementação do `SearchInput.tsx` com temporizador de debounce (350ms) para evitar requisições redundantes a cada tecla digitada e botão para limpeza rápida.
  * **Ergonomia e Sinais Visuais de Estoque:** No `ProductCard.tsx`, o botão de adicionar transforma-se em um seletor numérico `[-] qtd [+]` quando o item já está na cesta, com travas de estoque e badges semânticas (*Verde: Em estoque*, *Amarelo: Restam poucas unidades*, *Vermelho: Esgotado*).
  * **Feedback Acolhedor de Estado Vazio:** Caso uma busca não retorne itens, o mascote Dentinho orienta o cliente com simpatia a buscar por outro termo ou limpar os filtros.



* **Fase 4 — Carrinho de Compras em Drawer Lateral Deslizante:**
  * **Intervenção de UX do Desenvolvedor:** O desenvolvedor identificou que manter abas de categorias distantes do catálogo ou ter cabeçalhos redundantes prejudicava a usabilidade, especialmente com a altura do banner hero. Foi decidida a unificação do cabeçalho e abas em um container `sticky top-0 z-40` com rolagem suave (`scrollIntoView`) ao selecionar qualquer setor.
  * **Drawer Lateral Moderno (`CartDrawer.tsx`):** Substituição da seção estática por um painel deslizante da direita para a esquerda com efeito *backdrop blur*, fecho por tecla ESC, travamento do scroll do body e suporte integral a navegação por teclado (WCAG 2.1 AA).
  * **Resumo de Compra & Gamificação Positiva (`CartSummary.tsx`):** Criação de uma barra animada de progresso para Frete Grátis (*"Faltam R$ X para entrega grátis no seu bairro"*), indicador de cobertura do limite do Caderninho Digital para Dona Marta/Pedro, e botão flutuante de acesso rápido à cesta em qualquer ponto da rolagem.
  * **Controle Rigoroso de Estoque (`CartItemRow.tsx`):** Limitador visual e desabilitação automática do botão `[+]` quando a quantidade atinge o estoque disponível no balcão, prevenindo que o usuário compre itens indisponíveis.
  * **Sincronização Resiliente (`cartService.ts`):** Camada de serviço com chamadas assíncronas preparadas para a API REST do backend Spring Boot e fallback transparente para persistência local sanitizada no `localStorage`.

* **Fase 5 — Checkout e Gateway Humanizado de Alta Fidelidade:**
  * **Decisão Arquitetural Crítica (Gateway Sandbox vs. Simulador com Luhn):** Em discussão estratégica com a IA, o desenvolvedor questionou o uso de um gateway real (como Stripe ou Mercado Pago). Foi ponderado que depender de chaves de API externas em um teste técnico cria fragilidade (risco de falha se o avaliador não possuir credenciais no `.env` ou se faltar webhook público). Optou-se pela implementação de um **Gateway de Alta Fidelidade com Padrão Strategy**: validação matemática real de cartões com o **Algoritmo de Luhn (ISO/IEC 7812)**, detecção dinâmica de bandeira pelo BIN (*Visa, Mastercard, Elo, Hipercard*), payload de PIX no formato oficial do Banco Central (BR Code) e cartões de teste com 1 clique para o avaliador auditar cenários de aprovação, recusa por saldo e bloqueio de segurança.
  * **O Caderninho Digital do Seu Osvaldo como Diferencial:** Resgatando a história de 1987, o método proprietário permite aprovação com 1 clique para clientes cadastrados (Dona Marta com R$ 800 e Pedro com R$ 200 de limite de confiança), debitando o saldo em tempo real no `authStore`.
  * **PIX com Simulador de Compensação Bancária (`PixPayment.tsx`):** QR Code vetorial dinâmico, código Copia e Cola funcional, timer regressivo de 15 minutos e caixa de ferramentas para o avaliador simular a notificação do app do banco em tempo real.
  * **Resolução Crítica de Bug & Refatoração para Página Dedicada:** Em testes práticos de usabilidade, o desenvolvedor identificou que simular a aprovação/recusa no modal zerava os valores da compra prematuramente (devido à chamada precipitada de `clearCart()` antes da confirmação do pagamento) e causava sobreposição de modais. Além disso, questionou tecnicamente se um modal era a melhor solução. Com base nos padrões dos supermercados mais bem avaliados (Pão de Açúcar, Instacart, Ocado), o checkout foi completamente refatorado para uma **Página Dedicada com Stepper em 3 Etapas** (`CheckoutPage.tsx`), separando nitidamente a escolha de endereço/entrega (Entrega de Bairro vs. Retirada no Balcão) do pagamento, com resumo fixo da compra na lateral e garantia de retenção dos itens da cesta em caso de recusa. O carrinho só é limpo após o pagamento ser efetivamente confirmado.
  * **Validação Rigorosa com Zod & Experiência de Supermercado de Elite:** O formulário de cartão de crédito agora inicia completamente em branco por padrão e validação estrita via **Zod** (`checkoutValidation.ts` com checagem do Algoritmo de Luhn, formato MM/AA com validação de cartão não vencido e CVV). Para conforto da banca avaliadora, foi inserido um botão de destaque `⚡ Preencher Dados Válidos (1 Clique)`. Inspirado nas melhores redes do setor, o checkout inclui: **Janelas de Horário de Entrega (Delivery Slots)** (*Hoje Express em 35-50 min, Hoje à Noite, Amanhã pela Manhã*), **Política Inteligente de Substituição de Itens em Falta** (*Substituir por similar sem custo extra, Ligar/WhatsApp, Não substituir*), **Instruções Especiais para o Separador do Balcão** (*frutas maduras, frios finos*), **Cupons de Desconto** (`DENTINHO10`, `FRETEGRATIS`) e **Alertas Visuais Imediatos** posicionados logo abaixo do formulário de pagamento e acima do botão de confirmação, garantindo 100% de visibilidade no campo focal do cliente.
  * **Tela de Sucesso e Rastreio de Supermercado (`OrderSuccessView.tsx`):** A confirmação apresenta uma linha do tempo completa do supermercado (*Confirmado ➔ Em Separação na Horta/Padaria ➔ A Caminho ➔ Entregue*), celebração do Mascote Dentinho e impressão de recibo.

## 7. Reflexão Final

A construção do ecossistema front-end para o **Supermercado "Você no Coração da Gente" (Grupo Mateus)** representou um exercício completo e rigoroso de desenvolvimento assistido por Inteligência Artificial em regime de *Pair Programming*.

### 7.1 Ganhos Reais de Produtividade
* **Velocidade de Scaffolding e Infraestrutura:** A configuração inicial do ecossistema com Vite 6, React 19, TypeScript e Tailwind CSS v3.4 foi concluída de forma limpa, sem conflitos de dependências.
* **Componentes Ricos & Storytelling de Marca:** A criação dos artefatos visuais do mascote Dentinho em formato SVG puro (`dentinho-normal.svg`, `dentinho-carrinho.svg`, `dentinho-sucesso.svg`) e a paleta temática inspirada no Seu Osvaldo  e Dona Marta trouxeram uma identidade visual única e acolhedora.
* **Algoritmos Matemáticos & Validações Bancárias:** A implementação do **Algoritmo de Luhn (ISO/IEC 7812)**, do gerador de payload EMVCo para PIX e dos esquemas rigorosos do **Zod** ocorreu com precisão matemática imediata.

### 7.2 O Papel Indispensável da Curadoria e Intervenção Humana
A experiência comprovou que a IA atua como um acelerador extraordinário, mas **a visão de produto, a sensibilidade de usabilidade (UX) e o olhar crítico de engenharia pertencem ao desenvolvedor humano**:
1. **Identificação de Regra de Negócio & Bugs Críticos de Fluxo:** Foi a sensibilidade humana que detectou que a simulação bancária de recusa no checkout anterior zerava prematuramente os valores da compra. O desenvolvedor exigiu a garantia de retenção dos itens até a confirmação efetiva do pagamento.
2. **Evolução de Modal Genérico para Página de Supermercado de Elite:** O desenvolvedor questionou o formato de modal e solicitou a transição para uma página dedicada em 3 etapas com respiro visual, inspirada nos grandes players mundiais de grocery (Pão de Açúcar, Instacart, Ocado), introduzindo janelas de entrega (*Delivery Slots*), política de substituição de itens e observações de hortifrúti.
3. **Rigores de Validação (Zod) e Ergonomia Visual:** A percepção de que campos de cartão de crédito não podiam iniciar preenchidos e a observação precisa de que alertas no topo da tela ficavam fora do campo focal do usuário levaram ao reposicionamento dos alertas logo abaixo do formulário de pagamento e ao botão de 1 clique para a banca avaliadora.
4. **Acabamento Microinterativo:** A eliminação da quebra de linha no símbolo de moeda (`R$`) do `ProductCard` e a adição da animação física a 60fps no drawer lateral foram refinamentos guiados pelo olhar atento do desenvolvedor.

### 7.3 Conclusão
O resultado final é uma aplicação robusta, acessível, conteinerizada em Docker multi-stage com Nginx de alta performance e pronta para se integrar perfeitamente com a API REST Spring Boot em Java, honrando os valores e a história de acolhimento do Grupo Mateus.


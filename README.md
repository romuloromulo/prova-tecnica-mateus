# Supermercado "Você no Coração da Gente" — Desafio Técnico 2026
> *"Do balcão da esquina para a palma da mão do cliente"*  
> **Grupo Mateus — Prova Técnica Full Stack**

Aplicação completa de E-commerce desenvolvida para o Grupo Mateus, inspirada na história de 1987 do lendário caderninho azul do Seu Osvaldo e no mascote **Dentinho** (o castor de pelúcia mascote desde os anos 90).

---

## 🏛️ Arquitetura e Decisões Técnicas

### Front-end
* **Stack:** Vite 6 + React 19 + TypeScript + Tailwind CSS v3.4 + Lucide Icons + Canvas Confetti.
* **SPA Pura:** Comunicação direta com a API RESTful sem intermediário BFF.
* **Design System Institucional (Grupo Mateus):**
  * Azul Royal Principal (`#003893`)
  * Vermelho Coração (`#E31826`)
  * Azul Celeste / Turquesa (`#009EE3`)
  * Superfície Confortável (`#F8FAFC`)
* **Acessibilidade WCAG 2.1 AA (Persona Dona Marta, 72 anos):**
  * Barra superior [`A11yBar`](frontend/src/components/common/A11yBar.tsx) com ampliação seletiva de tipografia (`A-`, `Padrão`, `A+`) sem quebrar layouts ou containers.
  * Modo de Alto Contraste com paleta de alta legibilidade.
  * Alvos de clique confortáveis (mínimo 44x44px), navegação por teclado e semântica ARIA.
* **Mascote Dentinho:**
  * 3 poses exclusivas em SVG (`dentinho-ola.svg`, `dentinho-carrinho.svg`, `dentinho-sucesso.svg`).
  * Balão interativo de dicas [`DentinhoTip`](frontend/src/components/common/DentinhoTip.tsx) guiando o usuário.
* **Gerenciamento de Estado:** Zustand com persistência local para autenticação (`authStore`) e carrinho (`cartStore`).

### Back-end
* **Stack:** Java 21 LTS + Spring Boot 3.3.4 + Maven 3.9.
* **Persistência & Migrações:**
  * Spring Data JPA / Hibernate com `ddl-auto: validate`.
  * **Flyway Migrations:** `V1__create_tables.sql` (estrutura relacional e índices) e `V2__seed_initial_data.sql` (dados iniciais dos clientes e catálogo com 18 produtos).
  * Suporte híbrido: Banco em memória **H2** para desenvolvimento ágil e **PostgreSQL 16** para contêineres e produção.
* **Concorrência Otimista (Optimistic Locking):**
  * Coluna `version` mapeada com `@Version` na entidade `Product`, prevenindo race conditions e venda com estoque negativo em compras simultâneas.
* **Transações Atômicas & Checkout:**
  * `@Transactional(rollbackFor = Exception.class)` garantindo atomicidade estrita: validação de estoque, débito do saldo do Caderninho, baixa de estoque e snapshot imutável dos preços em `order_items`.
* **Segurança & JWT:**
  * Spring Security 6 em modo 100% Stateless (`SessionCreationPolicy.STATELESS`).
  * Assinatura criptográfica JJWT 0.12 (HMAC-SHA) com expiração de 24h e senhas protegidas com BCrypt.
* **Documentação Interativa:**
  * Springdoc OpenAPI 2.6.0 com Swagger UI acessível com suporte a Bearer Token.

---

## 📁 Estrutura de Pastas do Repositório

```text
├── backend/                              # API RESTful Spring Boot 3 (Java 21)
│   ├── src/main/java/com/grupomateus/supermarket/
│   │   ├── config/                       # SecurityConfig, OpenApiConfig
│   │   ├── controller/                   # Auth, Product, Cart, Order Controllers
│   │   ├── dto/                          # Java 21 Records (Request/Response DTOs)
│   │   ├── exception/                    # GlobalExceptionHandler (@RestControllerAdvice)
│   │   ├── model/                        # Entidades JPA (User, Product, Order, CartItem)
│   │   ├── repository/                   # Spring Data JPA Repositories
│   │   ├── security/                     # JwtTokenProvider, JwtAuthenticationFilter
│   │   └── service/                      # Regras de Negócio e Transações (@Transactional)
│   ├── src/main/resources/
│   │   ├── db/migration/                 # Flyway SQL (V1__create_tables, V2__seed_data)
│   │   └── application.yml               # Configurações multi-profile (dev/prod)
│   ├── src/test/java/...                 # 15 Testes Unitários Automatizados (JUnit 5 + Mockito)
│   ├── Dockerfile                        # Multi-stage build (Maven -> JRE 21 Alpine)
│   └── pom.xml                           # Gerenciador de dependências Maven
├── frontend/                             # Single Page Application React 19 + TypeScript
│   ├── public/mascote/                   # SVGs oficiais do castor Dentinho
│   ├── src/                              # Componentes, Hooks, Store (Zustand), Services
│   ├── Dockerfile                        # Multi-stage build (Node 20 -> Nginx Alpine)
│   └── nginx.conf                        # Servidor web com proxy reverso (/api/ -> backend)
├── docs/
│   └── relatorio-ia.md                   # Relatório de Uso de IA (Obrigatório na Parte I)
├── docker-compose.yml                    # Orquestração: PostgreSQL 16 + Backend + Frontend
└── README.md
```

---

## 🚀 Como Executar o Projeto

### Opção 1: Via Docker Compose (Recomendado — Solução Completa)
Com o Docker Desktop instalado e iniciado, execute na raiz do projeto:

```bash
docker compose up --build
```

A orquestração inicializará automaticamente:
1. **Banco de Dados PostgreSQL 16:** porta `5432` (com healthcheck ativo).
2. **Mensageria Distribuída Apache Kafka 3.7 (Modo KRaft):** portas `9092` e `29092` (com healthcheck ativo).
3. **Backend Spring Boot 3:** porta `8080` (aguarda Postgres e Kafka saudáveis; executa migrações Flyway na subida).
4. **Frontend Nginx + React:** portas `80` e `3000` (com proxy reverso para `/api/`).

**Acessos no navegador:**
* **Aplicação Web (E-commerce):** `http://localhost:3000` ou `http://localhost`
* **Swagger UI (Documentação da API):** `http://localhost:8080/swagger-ui.html`

---

### Opção 2: Execução Individual em Desenvolvimento

#### 1. Backend (Spring Boot 3)
* **Pré-requisito:** Java 17 ou 21 e Maven 3.8+ instalados.
```bash
cd backend
mvn clean compile
mvn test                 # Executa os 19 testes unitários automatizados
mvn spring-boot:run      # Inicia o servidor em http://localhost:8080
```
* **Console H2:** `http://localhost:8080/h2-console`  
  *(JDBC URL: `jdbc:h2:mem:supermarketdb`, Usuário: `sa`, Senha em branco)*

#### 2. Frontend (React 19 + Vite)
* **Pré-requisito:** Node.js 20+ e npm.
```bash
cd frontend
npm install
npm run dev              # Inicia o frontend em http://localhost:3000
```

---

## 🧪 Testes Automatizados

Para executar a suíte de testes unitários do backend:
```bash
cd backend
mvn test
```
* **Cobertura:** 19 testes automatizados (JUnit 5 + Mockito), validando:
  * Publicação e entrega de eventos assíncronos no Apache Kafka (`supermarket.orders.placed`);
  * Registro e login com criptografia BCrypt e geração de tokens JWT;
  * Validação atômica de concorrência e estoque na adição ao carrinho;
  * Bloqueio por saldo insuficiente no Caderninho Digital (`CaderninhoLimitExceededException`);
  * Validação e autorização bancária de cartões de crédito (com algoritmo de Luhn e cartões de teste de simulação);
  * Buscas, filtros por setor e paginação do catálogo de produtos.

---

## 📚 Documentação Complementar

* 📄 **[Relatório de Uso de Inteligência Artificial](docs/relatorio-ia.md):**  
  Documentação detalhando prompts, refinamentos e senso crítico aplicados no desenvolvimento.
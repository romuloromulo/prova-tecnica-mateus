# ==========================================
# Estágio 1: Build da Aplicação (Node 20 Alpine)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências primeiro para cache otimizado das camadas Docker
COPY package*.json ./

RUN npm ci

# Copia código-fonte e arquivos de configuração
COPY . .

# Compila o bundle estático otimizado para produção
RUN npm run build

# ==========================================
# Estágio 2: Servidor Web Nginx de Produção
# ==========================================
FROM nginx:1.27-alpine AS runner

# Remove configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia configuração customizada com proxy reverso e SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia artefatos estáticos gerados no build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck do container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

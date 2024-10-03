# Etapa 1: Build da aplicação
FROM node:18-alpine as builder
WORKDIR /app

# Instalação de dependências necessárias para o Puppeteer no Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init \
    font-noto \
    wqy-zenhei \
    bash \
    libc6-compat \
    mesa-gl \
    udev \
    xvfb

# Copia arquivos de dependências
COPY package.json package-lock.json ./

# Instalação das dependências da aplicação
RUN npm ci

# Copia o restante do código da aplicação
COPY . .

# Gera os artefatos do Prisma
RUN npx prisma generate
RUN npx prisma migrate deploy

# Gera o build da aplicação Next.js
RUN npm run build

# Etapa 2: Configuração do runner
FROM node:18-alpine as runner
WORKDIR /app

# Instala dependências para Puppeteer e Chromium no Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init \
    font-noto \
    wqy-zenhei \
    bash \
    libc6-compat \
    mesa-gl \
    udev \
    xvfb

# Copia os arquivos do build e as dependências
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/files ./files

# Configura o Puppeteer para usar o Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Expor a porta que a aplicação vai utilizar
EXPOSE 3000

# Usar o dumb-init como init para lidar com o sinal SIGINT e SIGTERM corretamente
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Comando de inicialização da aplicação
CMD ["npm", "start"]

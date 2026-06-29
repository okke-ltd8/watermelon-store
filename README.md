# 🍉 Watermelon Art — Loja Virtual

![Logo Watermelon Art](fotospng/logoloja.jpeg)

Loja virtual profissional para artista independente com estética kawaii. Construída com Next.js 15, Prisma, PostgreSQL e integração completa com Mercado Pago.

---

## ✨ Funcionalidades

- **Loja completa**: grid responsivo, filtros por categoria, busca em tempo real, ordenação
- **Produto**: galeria de imagens, avaliações, produtos relacionados
- **Carrinho persistente** (localStorage via Zustand)
- **Wishlist / Favoritos**
- **Sistema de cupons** com validação em tempo real
- **Checkout transparente** via Mercado Pago (PIX, cartão, boleto)
- **Webhooks** para atualização automática do status do pedido
- **Downloads protegidos** para produtos digitais
- **Sistema de pontos** para clientes
- **Área do cliente**: perfil, pedidos, favoritos, downloads
- **Painel admin**: dashboard, produtos, pedidos, clientes, cupons, avaliações, relatórios
- **Autenticação**: e-mail/senha + Google OAuth (NextAuth.js)
- **SEO completo**: sitemap automático, robots.txt, Open Graph
- **PWA instalável**

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | NextAuth.js v4 |
| Pagamentos | Mercado Pago SDK v2 |
| Estado global | Zustand |
| E-mail | Resend |
| Hospedagem recomendada | Vercel + Neon/Supabase |

---

## 🚀 Instalação e configuração

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL (local, [Neon](https://neon.tech), [Supabase](https://supabase.com) ou [Railway](https://railway.app))
- Conta no [Mercado Pago](https://www.mercadopago.com.br/developers)

### 2. Clonar e instalar

```bash
git clone https://github.com/seu-usuario/watermelon-store.git
cd watermelon-store
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com seus valores:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/watermelon_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com: openssl rand -base64 32"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_PUBLIC_KEY=""
MERCADOPAGO_WEBHOOK_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Configurar banco de dados

```bash
# Gerar o cliente Prisma
npm run db:generate

# Criar as tabelas
npm run db:migrate

# Popular com dados iniciais
npm run db:seed
```

### 5. Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 🔑 Credenciais padrão (após seed)

| Tipo | E-mail | Senha |
|------|--------|-------|
| Admin | dmin@watermelon.arat | admin123 |

> ⚠️ Troque a senha do admin imediatamente em produção!

---

## 💳 Configuração do Mercado Pago

### Obter credenciais

1. Acesse https://www.mercadopago.com.br/developers/panel
2. Crie um aplicativo
3. Copie `ACCESS_TOKEN` e `PUBLIC_KEY` (use as credenciais de **teste** primeiro)

### Configurar webhook

Para receber notificações de pagamento em desenvolvimento:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor a porta local
ngrok http 3000
```

No painel do Mercado Pago, configure a URL do webhook:
```
https://SEU-ID.ngrok.io/api/webhooks/mercadopago
```

Tópico: `payment`

### Fluxo de pagamento

```
Cliente → Carrinho → Checkout → Mercado Pago → Webhook → Pedido atualizado
```

### Cartões de teste (sandbox)

| Tipo | Número | Resultado |
|------|--------|-----------|
| Aprovado | 5031 7557 3453 0604 | Aprovado |
| Recusado | 4000 0000 0000 0002 | Recusado |
| CVV | 123 | — |
| Validade | 11/25 | — |

---

## 📁 Estrutura do projeto

```
watermelon/
├── prisma/
│   ├── schema.prisma          # Schema completo do banco
│   └── seed.ts                # Dados iniciais
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home
│   │   ├── loja/              # Listagem de produtos
│   │   ├── produto/[slug]/    # Produto individual
│   │   ├── carrinho/          # Carrinho
│   │   ├── checkout/          # Checkout + retorno MP
│   │   ├── sobre/             # Sobre a artista
│   │   ├── contato/           # Contato
│   │   ├── auth/              # Login e registro
│   │   ├── cliente/           # Área do cliente
│   │   ├── admin/             # Painel administrativo
│   │   └── api/               # API Routes
│   │       ├── auth/          # NextAuth + registro
│   │       ├── products/      # CRUD de produtos
│   │       ├── orders/        # Criar e listar pedidos
│   │       ├── coupons/       # Validar cupons
│   │       ├── reviews/       # Avaliações
│   │       ├── newsletter/    # Inscrição newsletter
│   │       ├── admin/         # Estatísticas admin
│   │       ├── user/          # Downloads protegidos
│   │       └── webhooks/      # Webhook Mercado Pago
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, Sidebars
│   │   ├── shop/              # ProductCard, ProductGrid
│   │   └── admin/             # AdminSidebar
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma singleton
│   │   ├── auth.ts            # Configuração NextAuth
│   │   ├── mercadopago.ts     # Helpers Mercado Pago
│   │   ├── store.ts           # Zustand (carrinho + wishlist)
│   │   └── utils.ts           # Utilitários
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   └── middleware.ts          # Proteção de rotas
├── public/
│   └── manifest.json          # PWA manifest
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 🚢 Deploy em produção

### Vercel + Neon (recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel e atualize:
- `NEXTAUTH_URL` → URL de produção
- `NEXT_PUBLIC_APP_URL` → URL de produção
- `MERCADOPAGO_ACCESS_TOKEN` → credencial de produção

### Executar migrations em produção

```bash
npm run db:migrate:prod
npm run db:seed
```

---

## 🎨 Personalização da marca

### Paleta de cores (tailwind.config.ts)

```js
watermelon: {
  pink:         '#FF4F87',   // Rosa principal
  'pink-light': '#FFF0F5',   // Rosa claro (backgrounds)
  green:        '#48C774',   // Verde (CTAs secundários)
  red:          '#FF5C5C',   // Vermelho (badges, alertas)
  dark:         '#0D1117',   // Fundo escuro (admin, footer)
}
```

### Adicionar produtos

1. Acesse `/admin` com as credenciais de admin
2. Vá em **Produtos → Novo produto**
3. Preencha nome, descrição, preço, categoria e imagens

---

## 📬 Suporte

- Instagram: [@lojinha.watermelon.ens](https://www.instagram.com/lojinha.watermelon.ens/)
- E-mail: oi@watermelon.art
- Discord: watermelon#0001

---

Feito com 🍉 e muito amor

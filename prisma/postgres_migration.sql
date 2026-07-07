-- Postgres-compatible migration generated from sqlite migration
-- Adjusted types: DATETIME -> TIMESTAMP

CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    "emailVerified" TIMESTAMP,
    password TEXT,
    image TEXT,
    role TEXT NOT NULL DEFAULT 'USER',
    points INTEGER NOT NULL DEFAULT 0,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP NOT NULL,
    CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    active boolean NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons (
    id TEXT NOT NULL PRIMARY KEY,
    code TEXT NOT NULL,
    description TEXT,
    "discountType" TEXT NOT NULL DEFAULT 'PERCENT',
    "discountValue" REAL NOT NULL,
    "minOrderValue" REAL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    "comparePrice" REAL,
    images TEXT NOT NULL,
    digital boolean NOT NULL DEFAULT true,
    "fileUrl" TEXT,
    active boolean NOT NULL DEFAULT true,
    featured boolean NOT NULL DEFAULT false,
    badge TEXT,
    stock INTEGER NOT NULL DEFAULT -1,
    "soldCount" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT products_categoryId_fkey FOREIGN KEY ("categoryId") REFERENCES categories (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    subtotal REAL NOT NULL,
    discount REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    "couponId" TEXT,
    "couponCode" TEXT,
    notes TEXT,
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT orders_userId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT orders_couponId_fkey FOREIGN KEY ("couponId") REFERENCES coupons (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    CONSTRAINT order_items_orderId_fkey FOREIGN KEY ("orderId") REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT order_items_productId_fkey FOREIGN KEY ("productId") REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    amount REAL NOT NULL,
    "mpPaymentId" TEXT,
    "mpStatus" TEXT,
    "mpStatusDetail" TEXT,
    "pixQrCode" TEXT,
    "pixQrCodeBase64" TEXT,
    "boletoUrl" TEXT,
    "boletoBarcode" TEXT,
    "paidAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT payments_orderId_fkey FOREIGN KEY ("orderId") REFERENCES orders (id) ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS reviews (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    approved boolean NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_userId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT reviews_productId_fkey FOREIGN KEY ("productId") REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlists (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT wishlists_userId_productId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT wishlists_productId_fkey FOREIGN KEY ("productId") REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS addresses (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT 'Casa',
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "isDefault" boolean NOT NULL DEFAULT false,
    CONSTRAINT addresses_userId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS downloads (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "orderId" TEXT,
    "downloadedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT downloads_userId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT downloads_productId_fkey FOREIGN KEY ("productId") REFERENCES products (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL,
    "userId" TEXT,
    active boolean NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT newsletter_subscribers_userId_fkey FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS banners (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "linkText" TEXT,
    active boolean NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS accounts_provider_providerAccountId_key ON accounts(provider, "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS sessions_sessionToken_key ON sessions("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS verification_tokens_token_key ON verification_tokens(token);
CREATE UNIQUE INDEX IF NOT EXISTS verification_tokens_identifier_token_key ON verification_tokens(identifier, token);
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_key ON categories(name);
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_key ON categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON products(slug);
CREATE UNIQUE INDEX IF NOT EXISTS payments_orderId_key ON payments("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS payments_mpPaymentId_key ON payments("mpPaymentId");
CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_key ON coupons(code);
CREATE UNIQUE INDEX IF NOT EXISTS reviews_userId_productId_key ON reviews("userId", "productId");
CREATE UNIQUE INDEX IF NOT EXISTS wishlists_userId_productId_key ON wishlists("userId", "productId");
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_key ON newsletter_subscribers(email);
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_userId_key ON newsletter_subscribers("userId");

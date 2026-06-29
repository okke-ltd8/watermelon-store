export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  digital: boolean
  fileUrl?: string
  active: boolean
  featured: boolean
  badge?: string
  stock: number
  soldCount: number
  categoryId: string
  category: Category
  avgRating?: number
  reviewCount?: number
  reviews?: Review[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image?: string
  active: boolean
  sortOrder: number
  _count?: { products: number }
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  subtotal: number
  discount: number
  total: number
  couponCode?: string
  mpPreferenceId?: string
  mpPaymentId?: string
  items: OrderItem[]
  payment?: Payment
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Pick<Product, 'name' | 'images' | 'slug'>
}

export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  mpPaymentId?: string
  pixQrCode?: string
  pixQrCodeBase64?: string
  boletoUrl?: string
  paidAt?: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment?: string
  approved: boolean
  createdAt: string
  user?: { name: string; image?: string }
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'USER' | 'ADMIN'
  points: number
}

export interface Coupon {
  id: string
  code: string
  description?: string
  discountType: 'PERCENT' | 'FIXED'
  discountValue: number
  minOrderValue?: number
  maxUses?: number
  usedCount: number
  active: boolean
  expiresAt?: string
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  imageUrl?: string
  linkUrl?: string
  linkText?: string
  active: boolean
}

export type OrderStatus =
  | 'PENDING' | 'WAITING_PAYMENT' | 'PAID'
  | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BOLETO'
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | 'CANCELLED'

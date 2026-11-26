export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
}

export interface Profile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  avatar: string | null
  role: string
  is_verified: boolean
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  product_count: number
}

export interface ProductImage {
  id: number
  image: string
  is_primary: boolean
}

export interface Product {
  id: number
  seller: number | { id: number; username: string; first_name: string; last_name: string }
  category: number | null | { id: number; name: string; slug: string; image: string | null }
  title: string
  description: string
  price: number | string
  condition: string
  location: string
  is_active: boolean
  is_sold: boolean
  created_at: string
  updated_at: string
  images: ProductImage[]
}

export interface CartItem {
  id: number
  product: number | Product
  product_id?: number
  quantity: number
  line_total: number | string
}

export interface Order {
  id: number
  user: number
  total: number | string
  status: string
  shipping_address: string
  phone: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  product: number | Product
  quantity: number
  price: number | string
  line_total: number | string
}

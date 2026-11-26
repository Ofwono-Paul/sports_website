import { api, setAuthToken, clearAuth } from './api'

export { setAuthToken, clearAuth }
import { User, AuthTokens, Product, Category, Order } from '@/types'

export const authAPI = {
  register: (data: {
    username: string; email: string; password: string;
    first_name?: string; last_name?: string; phone?: string;
    address?: string; city?: string;
  }) => api.post<{ user: User; tokens: AuthTokens }>('/auth/register/', data),
  login: (data: { username: string; password: string } | { email: string; password: string }) =>
    api.post<{ user: User; tokens: AuthTokens }>('/auth/login/', data),
  profile: () => api.get<ProfileType>('/auth/profile/'),
  updateProfile: (data: Partial<ProfileType>) => api.put<ProfileType>('/auth/profile/', data),
  logout: (refresh: string) => api.post('/auth/logout/', { refresh }),
}

export const productsAPI = {
  listCategories: () => api.get<Category[]>('/products/categories/'),
  listProducts: (params?: {
    category?: number; search?: string; condition?: string;
    ordering?: string; page?: number;
  }) => api.get<{ count: number; next: string | null; previous: string | null; results: Product[] }>('/products/', { params }),
  getProduct: (id: number | string) => api.get<Product>(`/products/${id}/`),
  createProduct: (data: FormData) => api.post<Product>('/products/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id: number | string, data: FormData | object) =>
    api.put<Product>(`/products/${id}/`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
    }),
  deleteProduct: (id: number | string) => api.delete(`/products/${id}/`),
  myProducts: () => api.get<Product[]>('/products/mine/'),
  markSold: (id: number | string) => api.post(`/products/${id}/mark_sold/`),
}

export const ordersAPI = {
  getCart: () => api.get<CartType>('/orders/cart/'),
  addToCart: (data: { product_id: number; quantity?: number }) =>
    api.post<CartType>('/orders/cart/add/', data),
  updateCartItem: (itemId: number, quantity: number) =>
    api.put<CartType>(`/orders/cart/item/${itemId}/`, { quantity }),
  removeCartItem: (itemId: number) => api.delete<CartType>(`/orders/cart/item/${itemId}/`),
  clearCart: () => api.delete<CartType>('/orders/cart/clear/'),
  checkout: (data: { shipping_address: string; phone?: string }) =>
    api.post<Order>('/orders/checkout/', data),
  listOrders: () => api<Order[]>('/orders/orders/'),
  getOrder: (id: number | string) => api<Order>(`/orders/orders/${id}/`),
}

export interface ProfileType {
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

export interface CartType {
  id: number
  items: CartItemType[]
  total_price: number | string
  item_count: number
}

export interface CartItemType {
  id: number
  product: any
  quantity: number
  line_total: number | string
}

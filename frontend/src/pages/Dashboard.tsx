import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { productsAPI, ordersAPI } from '@/services/endpoints'
import { Product, Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import { conditionLabel, conditionColor } from '@/utils/product'
import { Package, CreditCard, User as UserIcon, Trash2, Mail } from 'lucide-react'
import { toast } from 'react-hot-toast'

const TABS = [
  { key: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
  { key: 'products', label: 'My Listings', icon: <Package className="w-5 h-5" /> },
  { key: 'orders', label: 'Orders', icon: <CreditCard className="w-5 h-5" /> },
]

export const Dashboard = () => {
  const { tab } = useParams<{ tab?: string }>()
  const [activeTab, setActiveTab] = useState(tab || 'profile')
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout, refreshProfile, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    setLoading(true)
    Promise.all([
      productsAPI.myProducts().then((res) => setMyProducts(res.data)).catch(() => setMyProducts([])),
      ordersAPI.listOrders().then((res) => setMyOrders(res.data)).catch(() => setMyOrders([])),
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await productsAPI.deleteProduct(id)
      setMyProducts(myProducts.filter((p) => p.id !== id))
      toast.success('Listing deleted')
    } catch {
      toast.error('Failed to delete listing')
    }
  }

  const handleMarkSold = async (id: number) => {
    try {
      await productsAPI.markSold(id)
      setMyProducts(myProducts.map((p) => p.id === id ? { ...p, is_sold: true, is_active: false } : p))
      toast.success('Marked as sold')
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your listings, orders, and profile.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={logout} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-8 border-b border-gray-200 pb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-3 mb-2 border-b-2 text-sm font-medium transition-colors ${
              activeTab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">Loading...</div>
      ) : activeTab === 'profile' ? (
        <ProfileTab user={user} />
      ) : activeTab === 'products' ? (
        <ProductsTab myProducts={myProducts} onDelete={handleDeleteProduct} onMarkSold={handleMarkSold} />
      ) : (
        <OrdersTab myOrders={myOrders} />
      )}
    </div>
  )
}

const ProfileTab = ({ user }: { user: any }) => {
  const [editMode, setEditMode] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl">
              {(user?.first_name || user?.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{user?.first_name || ''} {user?.last_name || ''} || {user?.username}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
          <button
            onClick={() => setEditMode(!editMode)}
            className="w-full py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

const ProductsTab = ({ myProducts, onDelete, onMarkSold }: { myProducts: Product[]; onDelete: (id: number) => void; onMarkSold: (id: number) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-gray-900">My Listings ({myProducts.length})</h2>
        <Link to="/sell" className="btn-primary text-sm px-4 py-2.5">+ New Listing</Link>
      </div>
      {myProducts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500">You haven't listed any items yet.</p>
          <Link to="/sell" className="mt-4 inline-block btn-primary">List your first item</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {myProducts.map((p) => (
            <div key={p.id} className="card">
              <div className="relative h-48 overflow-hidden">
                {p.images[0] ? (
                  <img src={p.images[0].image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
                {p.is_sold && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Sold</span></div>}
                {!p.is_active && !p.is_sold && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">Inactive</span></div>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{p.title}</h3>
                <p className="text-sm text-gray-500">{formatPrice(p.price)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs font-medium ${conditionColor(p.condition)}`}>{conditionLabel(p.condition)}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => onMarkSold(p.id)} className="flex-1 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50">
                    Mark Sold
                  </button>
                  <button onClick={() => onDelete(p.id)} className="w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const OrdersTab = ({ myOrders }: { myOrders: Order[] }) => {
  return (
    <div className="space-y-6">
      <h2 className="font-bold text-lg text-gray-900">My Orders</h2>
      {myOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No orders yet.</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Order #</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Total</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-900 font-medium">#{o.id}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(o.created_at)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(o.status)}`}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const statusColor = (status: string) => {
  const c: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return c[status] || 'bg-gray-100 text-gray-700'
}

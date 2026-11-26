import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ShieldCheck, User, Package, CreditCard, LayoutDashboard, ArrowRight } from 'lucide-react'

export const Admin = () => {
  const { user } = useAuth()
  const isStaff = Boolean((user as any)?.is_staff)

  if (!isStaff) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center px-4 py-20">
        <ShieldCheck className="w-24 h-24 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
        <p className="text-gray-600 mb-6">You don't have permission to view the admin dashboard.</p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, listings, and orders.</p>
        </div>
        <Link to="/admin" className="hidden sm:block" target="_blank" rel="noreferrer">
          <button className="btn-primary flex items-center gap-2">
            Django Admin <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<LayoutDashboard className="w-6 h-6" />} title="Total Users" value="—" color="text-blue-600 bg-blue-50" />
        <StatCard icon={<Package className="w-6 h-6" />} title="Active Listings" value="—" color="text-green-600 bg-green-50" />
        <StatCard icon={<CreditCard className="w-6 h-6" />} title="Total Orders" value="—" color="text-indigo-600 bg-indigo-50" />
        <StatCard icon={<User className="w-6 h-6" />} title="Sellers" value="—" color="text-purple-600 bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Recent Users</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3"><span className="font-medium text-gray-900">demo@example.com</span></td>
                  <td className="px-4 py-3 text-gray-600 text-right">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/users/" className="block w-full text-left px-4 py-3 rounded-xl bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Manage Users
              </Link>
              <Link to="/admin/products/product/" className="block w-full text-left px-4 py-3 rounded-xl bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Manage Listings
              </Link>
              <Link to="/admin/orders/order/" className="block w-full text-left px-4 py-3 rounded-xl bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) => {
  return (
    <div className={`p-5 rounded-xl border border-gray-200 bg-white flex items-center gap-4 ${color}`}>
      <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

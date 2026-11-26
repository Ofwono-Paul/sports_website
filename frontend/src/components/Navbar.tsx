import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/products' },
    { name: 'Sell', path: '/sell' },
    { name: 'Cart', path: '/cart' },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">SportMart</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
                  <User size={16} /> {user?.first_name || user?.username}
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Join free
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}
      {open && (
        <div className="fixed inset-y-0 right-0 z-70 w-full max-w-xs bg-white shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out md:translate-x-0">
          <div className="flex items-center justify-between p-6 border-b">
            <span className="font-bold text-xl">Menu</span>
            <button onClick={() => setOpen(false)}><X size={24} /></button>
          </div>
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => { setOpen(false); handleLogout() }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary block text-center">
                  Join free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

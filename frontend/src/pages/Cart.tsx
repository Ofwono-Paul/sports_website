import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'
import { conditionLabel } from '@/utils/product'
import { ShoppingCart, ChevronLeft, Plus, Minus } from 'lucide-react'

export const Cart = () => {
  const { cart, itemCount, updateItem, removeItem, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const items = cart?.items ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/products" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
          <ChevronLeft size={16} /> Continue shopping
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <ShoppingCart size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-600 mt-2">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="mt-6 inline-block btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700 text-right">Price</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700 text-center">Qty</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700 text-right">Total</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const prod = typeof item.product === 'object' ? item.product : null
                  const img = prod?.images?.[0]
                  return (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          {img ? (
                            <img src={img.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                              ?
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{prod?.title || 'Product'}</p>
                            <p className="text-xs text-gray-500">{prod?.condition ? conditionLabel(prod.condition) : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-900 font-medium text-right">{formatPrice(prod?.price ?? 0)}</td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 text-right font-semibold">{formatPrice(item.line_total)}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {items.length > 0 && (
              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={clearCart} className="text-sm font-medium text-gray-500 hover:text-red-600">
                  Clear cart
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="font-medium">{formatPrice(cart?.total_price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">{formatPrice(cart?.total_price)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <button
                disabled={!isAuthenticated}
                onClick={() => isAuthenticated && navigate('/checkout')}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 ${
                  isAuthenticated ? 'btn-primary' : 'border border-gray-300 bg-gray-100 text-gray-500'
                }`}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to checkout'}
              </button>
              {isAuthenticated && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Secure payment. Your order is protected.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

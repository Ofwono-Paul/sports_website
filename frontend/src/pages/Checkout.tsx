import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { ordersAPI } from '@/services/endpoints'
import { formatPrice } from '@/utils/format'
import { toast } from 'react-hot-toast'
import { Phone, ChevronLeft, Lock } from 'lucide-react'

export const Checkout = () => {
  const [form, setForm] = useState({ shipping_address: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { cart, itemCount, clearCart } = useCart()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.shipping_address.trim()) {
      toast.error('Shipping address is required')
      return
    }
    setLoading(true)
    try {
      await ordersAPI.checkout({ shipping_address: form.shipping_address, phone: form.phone })
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/dashboard/orders', { replace: true })
    } catch {
      toast.error('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <a href="/cart" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
          <ChevronLeft size={16} /> Back to cart
        </a>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="font-bold text-lg text-gray-900 mb-6">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea
                  required
                  rows={3}
                  className="input"
                  value={form.shipping_address}
                  onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                  placeholder="123 Athlete Lane, Sports City, SC 12345"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    className="input pl-10"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Your order will be shipped to the address above. Items are delivered within 3-5 business days.
              </p>
              <button type="submit" className="btn-primary w-full py-4" disabled={loading}>
                {loading ? 'Placing order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({itemCount})</span>
                <span className="font-medium">{formatPrice(cart?.total_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">{formatPrice(cart?.total_price)}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure checkout</p>
                  <p className="text-xs text-gray-600">Payments processed securely via Stripe.</p>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center mt-4">
              By placing an order, you agree to our Terms of Service.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

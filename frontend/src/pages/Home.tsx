import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { productsAPI } from '@/services/endpoints'
import { Product } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { ArrowRight, ShoppingCart, Truck, Tag, ShieldCheck } from 'lucide-react'

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsAPI.listProducts({ page: 1 }).then((res) => {
      setProducts(res.data.results)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const featured = products.slice(0, 6)

  const features = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Verified Sellers', desc: 'Buy with confidence from trusted sports sellers.' },
    { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', desc: 'Get your gear delivered to your doorstep.' },
    { icon: <Tag className="w-6 h-6" />, title: 'Best Prices', desc: 'Great deals on new and used sports equipment.' },
    { icon: <ShoppingCart className="w-6 h-6" />, title: 'Easy Checkout', desc: 'Secure payments and order tracking.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Buy &amp; Sell Sports Gear
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          The marketplace for athletes. Discover quality sports equipment, apparel, and memorabilia — new and used.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/products" className="btn-primary">
            Browse Products <ArrowRight size={20} />
          </Link>
          <Link to="/sell" className="btn-outline">
            Sell Your Gear
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {features.map((f, i) => (
          <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">{f.icon}</div>
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
        <Link to="/products" className="text-sm font-semibold text-blue-600 hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">Loading...</div>
      ) : featured.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No products available yet.</div>
      )}
    </div>
  )
}

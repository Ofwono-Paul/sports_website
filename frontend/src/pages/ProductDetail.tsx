import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { productsAPI } from '@/services/endpoints'
import { Product } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import { conditionLabel, conditionColor } from '@/utils/product'
import { ShoppingCart, User, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    productsAPI.getProduct(id).then((res) => {
      setProduct(res.data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      toast.error('Product not found')
      navigate('/products')
    })
  }, [id, navigate])

  if (loading) return <div className="flex justify-center py-40">Loading...</div>
  if (!product) return null

  const primary = product.images.find((i) => i.is_primary) || product.images[0]
  const seller = typeof product.seller === 'object' ? product.seller : null

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    addToCart(Number(product.id), 1)
    toast.success('Added to cart')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="text-sm font-semibold text-blue-600 mb-6 inline-block hover:underline">
        ← Back to browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-100">
            {primary ? (
              <img src={primary.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setProduct({ ...product, images: [{ ...img, is_primary: true }, ...product.images.filter((i) => i.id !== img.id)] })}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 ${img.is_primary ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {product.is_sold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white text-lg font-bold px-6 py-2 rounded-full">SOLD</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.category && typeof product.category === 'object' && (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                {product.category.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Condition</p>
                <span className={`font-medium ${conditionColor(product.condition)}`}>
                  {conditionLabel(product.condition)}
                </span>
              </div>
              <div className="w-px h-5 bg-gray-300 mx-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                <span className="font-medium">{product.location}</span>
              </div>
              <div className="w-px h-5 bg-gray-300 mx-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Listed</p>
                <span className="font-medium">{formatDate(product.created_at)}</span>
              </div>
            </div>
          </div>

          {product.is_sold ? (
            <p className="text-center py-4 text-sm text-red-600 font-medium bg-red-50 rounded-xl border border-red-100">
              This item has been sold.
            </p>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!isAuthenticated}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              {isAuthenticated ? 'Add to Cart' : 'Sign in to buy'}
            </button>
          )}

          {seller && (
            <div className="mt-8 p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Seller</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{seller.first_name || seller.username}</p>
                  <p className="text-xs text-gray-500">{seller.username}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

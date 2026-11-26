import { Link } from 'react-router-dom'
import { Product } from '@/types'
import { formatPrice } from '@/utils/format'

export const ProductCard = ({ product }: { product: Product }) => {
  const primary = product.images.find((i) => i.is_primary) || product.images[0]
  const seller = typeof product.seller === 'object' ? product.seller : null
  return (
    <article className="card group">
      <div className="relative h-64 overflow-hidden">
        {primary ? (
          <img
            src={primary.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}
        {product.is_sold && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Sold
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.category && typeof product.category === 'object' && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {product.category.name}
            </span>
          )}
        </div>
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">{product.title}</h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1">{product.location}</p>
        {seller && (
          <p className="text-xs text-gray-500 mt-2">by {seller.first_name || seller.username}</p>
        )}
      </div>
    </article>
  )
}

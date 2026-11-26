import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { productsAPI } from '@/services/endpoints'
import { Product, Category } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { Search, Filter, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import { conditionLabel, conditionColor } from '@/utils/product'

const CONDITIONS = ['new', 'like_new', 'good', 'fair']

export const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    condition: searchParams.get('condition') || '',
    ordering: searchParams.get('ordering') || '-created_at',
  })
  const navigate = useNavigate()

  useEffect(() => {
    productsAPI.listCategories().then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params: any = {}
    if (filters.category) params.category = Number(filters.category)
    if (filters.search) params.search = filters.search
    if (filters.condition) params.condition = filters.condition
    params.ordering = filters.ordering
    params.page = 1

    productsAPI.listProducts(params).then((res) => {
      setProducts(res.data.results)
      setCount(res.data.count)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [filters.category, filters.search, filters.condition, filters.ordering])

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    const sp = new URLSearchParams(searchParams.toString())
    if (value) sp.set(key, value)
    else sp.delete(key)
    setSearchParams(sp)
    navigate({ search: sp.toString() })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
          <p className="text-gray-600">{count} listings found</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} /> Back to home
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={18} /> Filters
            </h3>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !filters.category ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateFilter('category', String(c.id))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.category === String(c.id) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <label className="text-sm font-medium text-gray-700">Condition</label>
              <div className="space-y-2">
                {CONDITIONS.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => updateFilter('condition', cond)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${conditionColor(cond)} ${
                      filters.condition === cond ? 'text-blue-600 ring-1 ring-blue-600' : ''
                    }`}
                  >
                    {conditionLabel(cond)}
                  </button>
                ))}
              </div>

              <label className="text-sm font-medium text-gray-700">Sort by</label>
              <select
                value={filters.ordering}
                onChange={(e) => updateFilter('ordering', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="-created_at">Newest first</option>
                <option value="created_at">Oldest first</option>
                <option value="price">Price: low to high</option>
                <option value="-price">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="flex items-end justify-between mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input pl-10"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search sports gear..."
              />
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <SlidersHorizontal size={32} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No products match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

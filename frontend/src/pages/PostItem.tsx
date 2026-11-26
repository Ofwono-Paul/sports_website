import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { productsAPI } from '@/services/endpoints'
import { toast } from 'react-hot-toast'
import { Plus, ArrowLeft, Trash2 } from 'lucide-react'

export const PostItem = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [editMode] = useState(!!id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'good',
    location: '',
    category: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newImages = [...images, ...files]
    setImages(newImages)
    files.forEach((f) => {
      setImagePreviews((prev) => [...prev, URL.createObjectURL(f)])
    })
  }

  const removePreview = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.price || !form.location) {
      toast.error('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('price', form.price)
    fd.append('condition', form.condition)
    fd.append('location', form.location)
    if (form.category) fd.append('category', form.category)
    images.forEach((f) => fd.append('image_files', f))

    try {
      if (editMode && id) {
        await productsAPI.updateProduct(id, fd)
        toast.success('Listing updated')
      } else {
        await productsAPI.createProduct(fd)
        toast.success('Listing created')
      }
      navigate('/dashboard/products')
    } catch {
      toast.error('Failed to save listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/dashboard/products" className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-6 inline-block hover:underline">
        <ArrowLeft size={16} /> Back to listings
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {editMode ? 'Edit Listing' : 'List Your Item'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Wilson NBA Basketball"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                className="input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                className="input"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (City)</label>
            <input
              type="text"
              required
              className="input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Los Angeles, CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select a category</option>
              <option value="1">Basketball</option>
              <option value="2">Football</option>
              <option value="3">Baseball</option>
              <option value="4">Soccer</option>
              <option value="5">Tennis</option>
              <option value="6">Golf</option>
              <option value="7">Fitness</option>
              <option value="8">Outdoor</option>
              <option value="9">Apparel</option>
              <option value="10">Memorabilia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              className="input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your item, brand, condition, and any details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-300">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removePreview(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                  <Plus size={20} className="mb-1" />
                  <span className="text-xs">Add image</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Up to 5 images. JPG or PNG, max 10MB each.</p>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : `${editMode ? 'Update' : 'Publish'} Listing`}
          </button>
        </form>
      </div>
    </div>
  )
}

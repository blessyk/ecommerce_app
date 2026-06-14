import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import api from '../services/api'
import { addItem } from '../store/cartSlice'
import { toast } from 'react-toastify'
import { ShoppingCart, ArrowLeft, Heart, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProductImage } from '../utils/imageHelper'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])
  const [qty, setQty] = useState(1)
  
  const auth = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProductAndRecs = async () => {
      setLoading(true)
      try {
        // Fetch current product details
        const res = await api.get(`/products/${id}`)
        const prodData = res.data
        setProduct(prodData)
        setQty(1) // Reset quantity picker

        // Fetch recommendations:
        // Use user-specific recommendations if logged in,
        // otherwise fetch related products in the same category
        if (auth.user?._id) {
          try {
            const recsRes = await api.get(`/recommendations/${auth.user._id}`)
            setRecommendations(recsRes.data.recommendations || [])
          } catch (recErr) {
            console.error('Error fetching personalized recommendations, loading fallback:', recErr)
            // Fallback to related products
            const fallbackRes = await api.get(`/products`, { params: { category: prodData.category } })
            setRecommendations(fallbackRes.data.filter((p) => p._id !== id).slice(0, 4))
          }
        } else {
          // Fallback to related products in same category
          const relatedRes = await api.get(`/products`, { params: { category: prodData.category } })
          setRecommendations(relatedRes.data.filter((p) => p._id !== id).slice(0, 4))
        }
      } catch (err) {
        console.error('Error fetching product details:', err)
        toast.error('Failed to load product details.')
      } finally {
        setLoading(false)
      }
    }

    fetchProductAndRecs()
  }, [id, auth.user?._id])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addItem({ ...product, qty }))
    toast.success(`${qty}x ${product.name} added to cart!`)
  }

  const handleIncrement = () => {
    if (qty < product.stock) {
      setQty(qty + 1)
    }
  }

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(qty - 1)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 w-20 rounded bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-800 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 w-2/3 rounded bg-slate-800" />
            <div className="h-4 w-1/4 rounded bg-slate-800" />
            <div className="h-20 w-full rounded bg-slate-800" />
            <div className="h-10 w-1/3 rounded bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-300">Product Not Found</h3>
        <p className="text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    )
  }

  const imageUrl = getProductImage(product)

  return (
    <div className="space-y-16">
      {/* Back to shop navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Catalog
        </Link>
      </div>

      {/* Main product view grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Side - Image card with border accent */}
        <div className="relative glass-panel rounded-3xl overflow-hidden aspect-square border border-slate-800 flex items-center justify-center bg-slate-950">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {product.category}
            </span>
          </div>
        </div>

        {/* Right Side - Info Column */}
        <div className="flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            {/* Price tag */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-white">
                ₹{product.price ? product.price.toFixed(2) : '0.00'}
              </span>
              {product.stock === 0 ? (
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                  Only {product.stock} units left
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  In Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              {product.description || 'Experience ultimate refinement with this product. Hand-selected for exceptional quality, modern design language, and everyday reliability.'}
            </p>
          </div>

          {/* Quantity selector & Add to Cart or Admin controls */}
          {auth.user?.role === 'admin' ? (
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <p className="text-xs text-emerald-300 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/10 leading-relaxed">
                You are viewing this catalog item as an Administrator. To update pricing, descriptions, or inventory stock levels, please use the Product Inventory manager inside the Admin Dashboard.
              </p>
              <Link
                to="/admin"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all text-center"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          ) : (
            product.stock > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-900">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-400">Quantity</span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={handleDecrement}
                      disabled={qty <= 1}
                      className="px-3 py-2 text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-slate-100 min-w-[3rem] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={qty >= product.stock}
                      className="px-3 py-2 text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart — ₹{(product.price * qty).toFixed(2)}
                  </button>
                  <button className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-850 hover:border-slate-750 transition-all">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            )
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-900 text-center text-xs text-slate-400">
            <div className="space-y-1">
              <Truck className="mx-auto text-indigo-400 mb-1" size={18} />
              <div className="font-semibold text-slate-200">Free Delivery</div>
              <div>Orders over ₹500</div>
            </div>
            <div className="space-y-1">
              <RotateCcw className="mx-auto text-indigo-400 mb-1" size={18} />
              <div className="font-semibold text-slate-200">30-Day Returns</div>
              <div>Hassle-free return policy</div>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="mx-auto text-indigo-400 mb-1" size={18} />
              <div className="font-semibold text-slate-200">Secured Payments</div>
              <div>SSL checkout encryption</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations / Related Products */}
      <section className="pt-8 border-t border-slate-900 text-left">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles size={22} className="text-indigo-400" />
          Recommended For You
        </h2>
        
        {recommendations.length === 0 ? (
          <div className="p-8 text-center glass-panel border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No related products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <div key={rec._id} className="h-full">
                <ProductCard product={rec} showReason={true} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

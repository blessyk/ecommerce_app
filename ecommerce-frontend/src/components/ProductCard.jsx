import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItem } from '../store/cartSlice'
import { toast } from 'react-toastify'
import { ShoppingCart, Eye, Sparkles } from 'lucide-react'
import { getProductImage } from '../utils/imageHelper'

export default function ProductCard({ product, showReason = false }) {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addItem(product))
    toast.success(`${product.name} added to cart!`)
  }

  // Determine stock level badges
  const getStockBadge = () => {
    if (product.stock === 0) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Out of Stock
        </span>
      )
    }
    if (product.stock <= 5) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Only {product.stock} left
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        In Stock
      </span>
    )
  }

  // Dynamic image matching
  const imageUrl = getProductImage(product)

  return (
    <div className="group glass-card glass-panel-hover flex flex-col h-full overflow-hidden relative border border-slate-800">
      {/* Product Image Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <Link
            to={`/product/${product._id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 text-slate-100 hover:bg-indigo-600 hover:text-white transition-all text-xs font-medium border border-slate-700 hover:border-indigo-500"
          >
            <Eye size={14} />
            Quick View
          </Link>
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-xs font-medium shadow-lg shadow-indigo-500/30"
            >
              <ShoppingCart size={14} />
              Add
            </button>
          )}
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-indigo-600/90 text-white backdrop-blur-md">
            {product.category}
          </span>
          {showReason && product.reason && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-purple-600/90 text-white backdrop-blur-md">
              <Sparkles size={10} />
              Recommended
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
              <Link to={`/product/${product._id}`}>{product.name}</Link>
            </h3>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed min-h-[40px]">
            {product.description || 'No description available for this premium item.'}
          </p>
        </div>

        <div>
          {/* Stock status & Pricing */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
            <div className="font-extrabold text-lg text-slate-100">
              ₹{product.price ? product.price.toFixed(2) : '0.00'}
            </div>
            {getStockBadge()}
          </div>

          {/* Special Recommendation Reason Balloon */}
          {showReason && product.reason && (
            <div className="mt-4 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300 flex items-start gap-1.5">
              <Sparkles size={14} className="shrink-0 mt-0.5 text-indigo-400" />
              <span>{product.reason}</span>
            </div>
          )}

          {/* Mobile visible action (in case hover isn't supported) */}
          <div className="mt-4 md:hidden flex gap-2">
            <Link
              to={`/product/${product._id}`}
              className="flex-1 text-center py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium"
            >
              Details
            </Link>
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

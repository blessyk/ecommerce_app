import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import { Search, SlidersHorizontal, RefreshCw, Star, Sparkles } from 'lucide-react'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Food', 'Toys', 'Accessories', 'Laptop']

export default function Home() {
  const auth = useSelector((s) => s.auth)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(false)
  
  // Search & Filter state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      
      // Translate sorting key for mongoose .sort(key)
      if (sort === 'price_asc') params.sort = 'price'
      else if (sort === 'price_desc') params.sort = '-price'
      else if (sort === 'name_asc') params.sort = 'name'
      else if (sort === 'name_desc') params.sort = '-name'

      const res = await api.get('/products', { params })
      setProducts(res.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [search, category, minPrice, maxPrice, sort])

  // Reactive triggering on search, sort, and category change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts()
    }, 300) // Debounce search changes

    return () => clearTimeout(delayDebounceFn)
  }, [fetchProducts])

  // Fetch Personalized recommendations if user is logged in
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!auth.user?._id) {
        setRecommendations([])
        return
      }
      setLoadingRecs(true)
      try {
        const res = await api.get(`/recommendations/${auth.user._id}/with-reason`)
        setRecommendations(res.data.recommendations || [])
      } catch (err) {
        console.error('Error fetching home recommendations:', err)
      } finally {
        setLoadingRecs(false)
      }
    }

    fetchRecommendations()
  }, [auth.user?._id])

  // Manual trigger for apply button (e.g. for price inputs)
  const handleApplyFilters = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleResetFilters = () => {
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSort('')
  }

  if (auth.user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="space-y-12">
      {/* Premium Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-6 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={12} />
            Unleash the Future of Shopping
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">
            Discover a New <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Shopping Aura</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Welcome to MyShopy. Explore our curated selection of premium products backed by smart neural recommendations tailored specifically to your taste.
          </p>
          <div className="flex gap-4">
            <a
              href="#catalog"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/20 hover:opacity-95 transition-all text-sm"
            >
              Explore Catalog
            </a>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="flex text-amber-400">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </div>
              <span>Trusted by 10k+ Customers</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="relative shrink-0 max-w-sm w-full h-64 md:h-80 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent" />
          <div className="text-center p-8 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 shadow-xl animate-bounce">
              <Sparkles size={40} />
            </div>
            <div className="text-sm font-semibold text-slate-200">Neural Recommendation Engine</div>
            <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Our advanced system learns from your purchase patterns to suggest products you'll love.
            </div>
          </div>
        </div>
      </section>

      {/* Personalized recommendations section based on user past orders */}
      {auth.user && recommendations.length > 0 && (
        <section className="space-y-6 text-left p-6 md:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/30 glass-panel shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="text-indigo-400 animate-pulse animate-duration-1000" size={20} />
                Neural Picks For You
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Curated suggestions derived from your purchase patterns.
              </p>
            </div>
          </div>

          {loadingRecs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card border border-slate-800 rounded-2xl h-80 animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.slice(0, 4).map((rec) => (
                <ProductCard key={rec._id} product={rec} showReason={true} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Catalog Search & Filters Bar */}
      <section id="catalog" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative flex-grow max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass-input rounded-2xl w-full"
            />
          </div>

          <div className="flex gap-3 shrink-0">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all border ${
                showFilters
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            {/* Sorting Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-5 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Sort Options</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Filters"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showFilters && (
          <form
            onSubmit={handleApplyFilters}
            className="p-6 rounded-2xl glass-panel border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-200"
          >
            {/* Price Filter */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300">Price Range</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full glass-input rounded-xl text-sm"
                />
                <span className="text-slate-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full glass-input rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Dummy Filter to align grid nicely */}
            <div className="hidden md:block" />

            {/* Action buttons inside filter panel */}
            <div className="flex items-end justify-end gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-all text-xs font-semibold"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all text-xs shadow-lg shadow-indigo-500/20"
              >
                Apply Range
              </button>
            </div>
          </form>
        )}

        {/* Category Badge Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setCategory('')}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all ${
              category === ''
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4.5 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Listing Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="glass-card border border-slate-800 rounded-2xl overflow-hidden aspect-[3/4] p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="aspect-square w-full rounded-xl animate-shimmer" />
                  <div className="h-4 w-2/3 rounded animate-shimmer" />
                  <div className="h-3 w-full rounded animate-shimmer" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/4 rounded animate-shimmer" />
                  <div className="h-6 w-1/3 rounded animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 glass-panel border border-slate-800 rounded-3xl space-y-4">
            <div className="text-slate-600 text-5xl">📦</div>
            <h3 className="text-lg font-bold text-slate-200">No Products Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any products matching your active filters. Try resetting your search query or price limit.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4.5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

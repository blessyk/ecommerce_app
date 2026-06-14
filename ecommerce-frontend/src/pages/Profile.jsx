import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { updateProfile, deleteAccount } from '../store/authSlice'
import { toast } from 'react-toastify'
import ProductCard from '../components/ProductCard'
import { ShoppingBag, Sparkles, Settings, AlertTriangle, Calendar, Receipt, ChevronRight } from 'lucide-react'

export default function Profile() {
  const auth = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Tabs: 'orders' | 'settings' | 'recommendations'
  const [activeTab, setActiveTab] = useState('orders')
  
  // Settings Form States
  const [name, setName] = useState(auth.user?.name || '')
  const [email, setEmail] = useState(auth.user?.email || '')
  const [password, setPassword] = useState('')
  const [updating, setUpdating] = useState(false)
  
  // Data States
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [recs, setRecs] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(true)

  // Fetch Order History
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true)
      try {
        const res = await api.get('/orders')
        // Filter orders for this specific user
        const userOrders = res.data.filter(
          (order) =>
            order.user?._id === auth.user?._id ||
            order.user === auth.user?._id
        )
        // Sort orders by date descending
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setOrders(userOrders)
      } catch (err) {
        console.error('Error fetching orders:', err)
        toast.error('Failed to load order history.')
      } finally {
        setLoadingOrders(false)
      }
    }

    if (auth.user?._id) {
      fetchOrders()
    }
  }, [auth.user?._id])

  // Fetch Recommendations
  useEffect(() => {
    const fetchRecs = async () => {
      setLoadingRecs(true)
      try {
        const res = await api.get(`/recommendations/${auth.user?._id}/with-reason`)
        setRecs(res.data.recommendations || [])
      } catch (err) {
        console.error('Error fetching recommendations with reasons:', err)
        toast.error('Failed to load neural recommendations.')
      } finally {
        setLoadingRecs(false)
      }
    }

    if (auth.user?._id) {
      fetchRecs()
    }
  }, [auth.user?._id])

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!name || !email) {
      toast.error('Name and Email cannot be empty.')
      return
    }
    setUpdating(true)
    try {
      const payload = { name, email }
      if (password) payload.password = password
      
      await dispatch(updateProfile(payload)).unwrap()
      toast.success('Profile updated successfully!')
      setPassword('')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.')
    } finally {
      setUpdating(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'WARNING: Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.'
    )
    if (!confirmDelete) return

    try {
      await dispatch(deleteAccount()).unwrap()
      toast.success('Your account has been deleted.')
      navigate('/register')
    } catch {
      toast.error('Failed to delete account. Try again.')
    }
  }

  // Get Order Status Color badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Delivered
          </span>
        )
      case 'Processing':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Processing
          </span>
        )
      default: // Pending
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Dashboard Welcome Header */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
            {auth.user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{auth.user?.name}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{auth.user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
              {auth.user?.role} Account
            </span>
          </div>
        </div>

        {/* Tab Selector Pill Button */}
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag size={14} />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            Recommended
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings size={14} />
            Settings
          </button>
        </div>
      </div>

      {/* Main View Area based on activeTab */}
      <div className="transition-all duration-300">
        {/* Tab 1: Order History Timeline */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200">Your Order Timeline</h2>

            {loadingOrders ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass-card border border-slate-800 p-6 rounded-2xl space-y-3 animate-pulse">
                    <div className="h-4 w-1/4 rounded bg-slate-800" />
                    <div className="h-4 w-1/3 rounded bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 glass-panel border border-slate-800 rounded-3xl space-y-4">
                <div className="text-slate-600 text-4xl">📦</div>
                <h3 className="text-lg font-bold text-slate-300">No Orders Placed Yet</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  It looks like you haven't placed any orders yet. Explore our shop catalog to get started.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 border-l border-slate-800/80 ml-4">
                {orders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  
                  return (
                    <div
                      key={order._id}
                      className="relative timeline-item glass-card border border-slate-800 p-6 shadow-lg hover:border-slate-700 transition-colors"
                    >
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-7 bg-slate-950 border-2 border-indigo-500 rounded-full h-4 w-4 z-10" />

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
                        <div className="space-y-1">
                          <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
                            Order ID: <span className="text-slate-400">#{order._id.slice(-8)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-300 font-bold">
                            <Calendar size={14} className="text-indigo-400" />
                            {orderDate}
                          </div>
                        </div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>

                      {/* Products Summary */}
                      <div className="py-4 space-y-3">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <ChevronRight size={14} className="text-slate-600" />
                              <span className="text-slate-200 truncate">
                                {item.product?.name || 'Unknown Item'}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-bold">
                                x{item.quantity}
                              </span>
                            </div>
                            <span className="text-slate-400 font-medium shrink-0">
                              ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Summary Charge Footer */}
                      <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Receipt size={14} className="text-indigo-400" />
                          Amount Invoiced
                        </div>
                        <span className="text-base font-black text-white">
                          ₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Recommendations with Reasoning */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="space-y-1 text-left">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="text-indigo-400 animate-pulse" size={22} />
                Smart Neural Recommendations
              </h2>
              <p className="text-xs text-slate-500">
                These suggestions are computed using a TensorFlow neural network that scores products based on your purchase histories and category affinity.
              </p>
            </div>

            {loadingRecs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-card border border-slate-800 rounded-2xl h-80 animate-shimmer"
                  />
                ))}
              </div>
            ) : recs.length === 0 ? (
              <div className="text-center py-16 glass-panel border border-slate-800 rounded-3xl space-y-4">
                <div className="text-slate-600 text-4xl">🤖</div>
                <h3 className="text-lg font-bold text-slate-300">No Recommendations Available</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Our neural network needs order patterns to calculate recommendations. Place your first order to retrain the model!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
                {recs.map((rec) => (
                  <ProductCard key={rec._id} product={rec} showReason={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Settings Form */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
            {/* Credentials edit form */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-slate-200 border-b border-slate-900 pb-2">
                Account Credentials
              </h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Change Password (Leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    placeholder="New password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  {updating ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </form>
            </div>

            {/* Danger Zone panel */}
            <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-4">
              <h2 className="text-base font-bold text-rose-400 flex items-center gap-1.5 pb-2 border-b border-rose-500/10">
                <AlertTriangle size={18} />
                Danger Zone
              </h2>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                Deleting your account is permanent. This wipes your order histories, saved addresses, and all profile patterns permanently from the database.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { clearCart } from '../store/cartSlice'
import { toast } from 'react-toastify'
import { CreditCard, ShoppingBag, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react'

export default function Checkout() {
  const cart = useSelector((s) => s.cart)
  const auth = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Form states
  const [name, setName] = useState(auth.user?.name || '')
  const [email, setEmail] = useState(auth.user?.email || '')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Calculations
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0)
  const shipping = subtotal > 500 ? 0 : 99
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-200">No items to checkout</h2>
        <p className="text-slate-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    )
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    if (!address || !city || !zipCode) {
      toast.error('Please fill in all shipping details.')
      return
    }
    if (!cardNumber || !expiry || !cvv) {
      toast.error('Please fill in payment details.')
      return
    }

    setSubmitting(true)
    try {
      // Structure payload for POST /orders
      const payload = {
        products: cart.items.map((item) => ({
          product: item._id,
          quantity: item.qty || 1,
        })),
        totalAmount: grandTotal,
      }

      await api.post('/orders', payload)

      toast.success('Order placed successfully!')
      dispatch(clearCart())
      navigate('/profile')
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
        <CreditCard className="text-indigo-400" size={28} />
        Complete Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Columns - Checkout Forms */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-3 space-y-6">
          {/* Shipping Address Panel */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-200 border-b border-slate-900 pb-2">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="123 Main St, Apt 4B"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="New York"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Zip / Postal Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Secure Payment Panel */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="text-emerald-400" size={16} />
              Secure Mock Payment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-4">
                <label className="text-xs font-semibold text-slate-400">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="4111 2222 3333 4444"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400">Expiration Date</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400">CVV</label>
                <input
                  type="password"
                  required
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full glass-input text-sm"
                  placeholder="•••"
                />
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing Order...
              </>
            ) : (
              `Pay & Place Order — ₹${grandTotal.toFixed(2)}`
            )}
          </button>
        </form>

        {/* Right Column - Order Recap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <ShoppingBag className="text-indigo-400" size={16} />
              Review Items ({cart.items.length})
            </h2>

            <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <li key={item._id} className="flex justify-between items-center gap-3 py-1 text-sm">
                  <div className="min-w-0 flex-grow">
                    <span className="font-semibold text-slate-200 block truncate">{item.name}</span>
                    <span className="text-xs text-slate-400">Qty: {item.qty}</span>
                  </div>
                  <span className="font-bold text-slate-300 shrink-0">
                    ₹{((item.price || 0) * (item.qty || 1)).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-slate-900 text-xs space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-200">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-200">
                  {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-semibold text-slate-200">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-950 flex justify-between items-center text-sm font-extrabold text-white">
                <span>Grand Total</span>
                <span className="text-indigo-400 text-base">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

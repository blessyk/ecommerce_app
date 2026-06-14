import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeItem, updateQuantity, clearCart } from '../store/cartSlice'
import { toast } from 'react-toastify'
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react'
import { getProductImage } from '../utils/imageHelper'

export default function Cart() {
  const cart = useSelector((s) => s.cart)
  const auth = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  const handleQtyChange = (id, currentQty, amount, stock) => {
    const newQty = currentQty + amount
    if (newQty < 1) return
    if (newQty > stock) {
      toast.warning(`Only ${stock} units are available in stock.`)
      return
    }
    dispatch(updateQuantity({ id, qty: newQty }))
  }

  const handleRemove = (id, name) => {
    dispatch(removeItem(id))
    toast.info(`${name} removed from cart.`)
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your shopping cart?')) {
      dispatch(clearCart())
      toast.info('Shopping cart cleared.')
    }
  }

  // Calculation summaries
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0)
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 99
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  return (
    <div className="space-y-8 text-left">
      <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
        <ShoppingBag className="text-indigo-400" size={28} />
        Your Shopping Cart
      </h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-20 glass-panel border border-slate-800 rounded-3xl space-y-5">
          <div className="text-slate-600 text-5xl">🛒</div>
          <h2 className="text-xl font-bold text-slate-200">Your cart is empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Before you can checkout, you must add some products to your shopping cart.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all text-xs"
          >
            Go Shopping
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-sm font-medium text-slate-400">{cart.items.length} unique items</span>
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} />
                Clear Cart
              </button>
            </div>

            <ul className="space-y-4">
              {cart.items.map((item) => {
                const itemImg = getProductImage(item)
                const itemSubtotal = (item.price || 0) * (item.qty || 1)
                
                return (
                  <li
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl glass-card border border-slate-800 gap-4"
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-4 flex-grow">
                      <img
                        src={itemImg}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl bg-slate-900 border border-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-slate-100 hover:text-indigo-400 text-sm md:text-base line-clamp-1">
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </h3>
                        <p className="text-xs text-indigo-400 mt-0.5">{item.category}</p>
                      </div>
                    </div>

                    {/* Quantity selectors & pricing */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-900">
                      {/* Price per item */}
                      <div className="text-slate-400 text-xs shrink-0">
                        ₹{item.price?.toFixed(2)} each
                      </div>

                      {/* Quantity box */}
                      <div className="flex items-center bg-slate-950 border border-slate-900 rounded-lg overflow-hidden scale-90">
                        <button
                          onClick={() => handleQtyChange(item._id, item.qty || 1, -1, item.stock)}
                          className="px-2.5 py-1 text-slate-400 hover:bg-slate-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 font-bold text-xs text-slate-100 min-w-[2rem] text-center">
                          {item.qty || 1}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item._id, item.qty || 1, 1, item.stock)}
                          className="px-2.5 py-1 text-slate-400 hover:bg-slate-800 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Total price & remove button */}
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold text-slate-100 text-sm md:text-base">
                          ₹{itemSubtotal.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemove(item._id, item.name)}
                          className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Right Side: Order Summary Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
              <h2 className="text-lg font-bold text-slate-200 pb-3 border-b border-slate-900">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-200">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-200">₹{tax.toFixed(2)}</span>
                </div>
                
                {shipping > 0 && (
                  <p className="text-[10px] text-indigo-400 text-right">
                    Spend ₹{(500 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}

                <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-base font-bold text-white">
                  <span>Order Total</span>
                  <span className="text-indigo-400">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              {auth.user ? (
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all text-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login?redirect=checkout"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all text-center"
                  >
                    Sign In to Checkout
                    <ArrowRight size={16} />
                  </Link>
                  <p className="text-[10px] text-slate-500 text-center">
                    You need to create or log in to your account to complete checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Safety badge summary */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Security Guaranteed</span>
                Your personal credentials and purchase data are protected by modern end-to-end security layers.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

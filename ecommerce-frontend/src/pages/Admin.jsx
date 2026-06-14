import { useEffect, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import { getProductImage } from '../utils/imageHelper'
import {
  Package,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  X,
  Loader2,
  Layers
} from 'lucide-react'

export default function Admin() {
  // Tabs: 'inventory' | 'orders'
  const [activeTab, setActiveTab] = useState('inventory')

  // Product Inventory states
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Order Manager states
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(null) // ID of order updating

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [currentProductId, setCurrentProductId] = useState(null)
  
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')
  const [submittingProduct, setSubmittingProduct] = useState(false)

  // Fetch data
  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error('Error fetching admin products:', err)
      toast.error('Failed to load products.')
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await api.get('/orders')
      // Sort orders by date descending
      const sortedOrders = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(sortedOrders)
    } catch (err) {
      console.error('Error fetching admin orders:', err)
      toast.error('Failed to load orders.')
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchProducts()
      await fetchOrders()
    }
    init()
  }, [])

  // Product Operations
  const handleOpenCreateModal = () => {
    setModalMode('create')
    setCurrentProductId(null)
    setName('')
    setCategory('Electronics')
    setPrice('')
    setDescription('')
    setStock('')
    setImage('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (prod) => {
    setModalMode('edit')
    setCurrentProductId(prod._id)
    setName(prod.name)
    setCategory(prod.category)
    setPrice(prod.price)
    setDescription(prod.description || '')
    setStock(prod.stock)
    setImage(prod.image || '')
    setIsModalOpen(true)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    if (!name || !category || price === '' || stock === '') {
      toast.error('Please fill all required fields.')
      return
    }
    if (Number(price) < 0 || Number(stock) < 0) {
      toast.error('Price and stock must be positive numbers.')
      return
    }

    setSubmittingProduct(true)
    try {
      const payload = {
        name,
        category,
        price: Number(price),
        description,
        stock: Number(stock),
        image: image || undefined
      }

      if (modalMode === 'create') {
        await api.post('/products', payload)
        toast.success(`Product "${name}" created successfully!`)
      } else {
        await api.put(`/products/${currentProductId}`, payload)
        toast.success(`Product "${name}" updated successfully!`)
      }

      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      console.error('Error submitting product:', err)
      toast.error(err.response?.data?.message || 'Failed to submit product details.')
    } finally {
      setSubmittingProduct(false)
    }
  }

  const handleProductDelete = async (id, prodName) => {
    if (!window.confirm(`Are you sure you want to delete product "${prodName}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.info(`Product "${prodName}" deleted.`)
      fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      toast.error('Failed to delete product.')
    }
  }

  // Order Operations
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderStatus(orderId)
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus })
      toast.success(`Order status updated to ${newStatus}`)
      fetchOrders()
    } catch (err) {
      console.error('Error updating order status:', err)
      toast.error('Failed to update order status.')
    } finally {
      setUpdatingOrderStatus(null)
    }
  }

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length
  const categoriesList = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Food', 'Toys', 'Accessories', 'Laptop']

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Page Title & Tab Switch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Operations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage product inventory items and track checkout status details.
          </p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package size={14} />
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag size={14} />
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Quick Statistics Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Revenue</span>
            <span className="text-2xl font-black text-white block mt-1">₹{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Active Products</span>
            <span className="text-2xl font-black text-white block mt-1">{products.length}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-405 rounded-xl border border-emerald-500/20">
            <Package size={20} />
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Orders</span>
            <span className="text-2xl font-black text-white block mt-1">{orders.length}</span>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Pending Orders</span>
            <span className="text-2xl font-black text-white block mt-1">{pendingOrders}</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Main Tab content displays */}
      <div>
        {/* Tab 1: Product Inventory Manager */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-200">Catalog Inventory</h2>
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                Add New Product
              </button>
            </div>

            {loadingProducts ? (
              <div className="glass-panel border border-slate-800 rounded-2xl p-12 text-center">
                <Loader2 className="animate-spin text-emerald-400 mx-auto" size={32} />
                <span className="text-sm text-slate-500 mt-2 block">Loading catalog items...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="glass-panel border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                No products found in database. Create one to get started.
              </div>
            ) : (
              <div className="overflow-x-auto glass-panel border border-slate-800 rounded-2xl">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-400 text-xs font-bold uppercase">
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {products.map((prod) => {
                      const img = getProductImage(prod)
                      return (
                        <tr key={prod._id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="px-6 py-4">
                            <img
                              src={img}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-800 bg-slate-950 shrink-0"
                            />
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-200">{prod.name}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/10">
                              {prod.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-300">
                            ₹{prod.price?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            {prod.stock === 0 ? (
                              <span className="text-rose-400 font-bold">Out of Stock</span>
                            ) : prod.stock <= 5 ? (
                              <span className="text-amber-400 font-semibold">{prod.stock} left</span>
                            ) : (
                              <span className="text-slate-400">{prod.stock} units</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-350 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleProductDelete(prod._id, prod.name)}
                                className="p-2 rounded-lg bg-slate-850 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Order Manager */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-200">Customer Orders</h2>

            {loadingOrders ? (
              <div className="glass-panel border border-slate-800 rounded-2xl p-12 text-center">
                <Loader2 className="animate-spin text-emerald-400 mx-auto" size={32} />
                <span className="text-sm text-slate-500 mt-2 block">Loading checkout orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="glass-panel border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                No orders placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto glass-panel border border-slate-800 rounded-2xl">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-400 text-xs font-bold uppercase">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Products</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {orders.map((order) => {
                      const customerName = order.user?.name || 'Deleted Account'
                      const customerEmail = order.user?.email || 'N/A'
                      return (
                        <tr key={order._id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-emerald-400">
                            #{order._id.slice(-8)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-200">{customerName}</div>
                            <div className="text-[10px] text-slate-500">{customerEmail}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="space-y-1 text-xs text-slate-400">
                              {order.products.map((item, idx) => (
                                <div key={idx} className="truncate">
                                  • {item.product?.name || 'Deleted Product'} (x{item.quantity})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-300">
                            ₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-6 py-4">
                            {updatingOrderStatus === order._id ? (
                              <div className="flex items-center gap-1 text-slate-500 text-xs">
                                <Loader2 className="animate-spin" size={12} />
                                Saving...
                              </div>
                            ) : (
                              <select
                                value={order.status}
                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-950 border focus:outline-none focus:border-emerald-500 cursor-pointer ${
                                  order.status === 'Delivered'
                                    ? 'border-emerald-500/20 text-emerald-400'
                                    : order.status === 'Processing'
                                    ? 'border-teal-500/20 text-teal-400'
                                    : 'border-amber-500/20 text-amber-400'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-slate-500 font-mono">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Dialog for Product Creation/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl glass-panel border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white rounded-lg transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="text-emerald-400" size={20} />
              {modalMode === 'create' ? 'Create New Product' : 'Modify Product Credentials'}
            </h2>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input"
                  placeholder="e.g. Premium Wireless Earbuds"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full glass-input bg-slate-900 focus:outline-none"
                  >
                    {categoriesList.map((cat) => (
                      <option value={cat} key={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Price (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full glass-input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full glass-input"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full glass-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Product Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full glass-input resize-none"
                  placeholder="Provide an enticing summary description..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white font-semibold transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingProduct && <Loader2 className="animate-spin" size={14} />}
                  {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

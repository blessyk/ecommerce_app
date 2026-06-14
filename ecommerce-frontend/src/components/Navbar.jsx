import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { ShoppingCart, User, LogOut, Menu, X, Store } from 'lucide-react'

export default function Navbar() {
  const auth = useSelector((s) => s.auth)
  const cart = useSelector((s) => s.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartItemsCount = cart.items.reduce((acc, item) => acc + (item.qty || 1), 0)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const isAdmin = auth.user?.role === 'admin'

  // Dynamic branding details
  const logoPath = isAdmin ? '/admin' : '/'
  const logoText = isAdmin ? 'MyShopy Admin' : 'MyShopy'

  // Dynamic links list based on role
  const navLinks = isAdmin
    ? [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Contact', path: '/contact' },
      ]
    : [
        { name: 'Shop', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b text-slate-100 transition-all duration-300 ${
      isAdmin ? 'bg-slate-950/90 border-emerald-500/10' : 'bg-slate-900/80 border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={logoPath} className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl text-white shadow-lg transition-colors ${
              isAdmin
                ? 'bg-emerald-600 group-hover:bg-emerald-500 shadow-emerald-500/30'
                : 'bg-indigo-600 group-hover:bg-indigo-500 shadow-indigo-500/30'
            }`}>
              <Store size={20} />
            </div>
            <span className={`text-xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent group-hover:opacity-90 transition-opacity ${
              isAdmin
                ? 'from-emerald-400 via-teal-400 to-cyan-400'
                : 'from-indigo-400 via-purple-400 to-pink-400'
            }`}>
              {logoText}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isAdmin
                    ? isActive(link.path) ? 'text-emerald-400 font-semibold' : 'text-slate-350 hover:text-emerald-300'
                    : isActive(link.path) ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-indigo-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Icon (Customers Only) */}
            {!isAdmin && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-300 hover:text-indigo-400 transition-colors duration-200"
              >
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900 animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth / Admin actions */}
            {auth.user ? (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  // Admin Header Status Badge
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/20 bg-emerald-500/5 text-emerald-350">
                    <User size={14} className="text-emerald-400" />
                    <span>Admin: {auth.user.name}</span>
                  </div>
                ) : (
                  // Customer Profile link
                  <Link
                    to="/profile"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all ${
                      isActive('/profile') ? 'ring-2 ring-indigo-500/50' : ''
                    }`}
                  >
                    <User size={16} />
                    <span>{auth.user.name}</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-450 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 hover:opacity-95 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden gap-3">
            {!isAdmin && (
              <Link to="/cart" className="relative p-2 text-slate-300">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Down */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isAdmin
                    ? isActive(link.path) ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-350 hover:bg-slate-900 hover:text-emerald-300'
                    : isActive(link.path) ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {auth.user ? (
              <>
                {isAdmin ? (
                  <div className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400">
                    Logged in as Admin: {auth.user.name}
                  </div>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive('/profile') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    My Profile ({auth.user.name})
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-rose-450 hover:bg-rose-500/10 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-4 pb-2 border-t border-slate-800 flex flex-col gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-slate-300 border border-slate-700 hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

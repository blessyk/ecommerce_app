import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      toast.error('Please enter email and password.')
      return
    }

    try {
      await dispatch(login({ email, password })).unwrap()
      toast.success('Welcome back!')
      navigate(redirect)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login failed')
      toast.error(err?.response?.data?.message || err?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center relative">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

      <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-6 text-left relative overflow-hidden">
        {/* Subtle top decoration */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        <div className="space-y-2 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mb-2">
            <LogIn size={26} />
          </div>
          <h2 className="text-2xl font-black text-white">Sign In</h2>
          <p className="text-xs text-slate-500">
            Welcome back to AuraCart. Please log in to complete your checkout.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-rose-500/15 bg-rose-500/5 text-xs text-rose-400 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Mail size={13} />
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full glass-input text-sm"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Lock size={13} />
              Password
            </label>
            <input
              type="password"
              required
              className="w-full glass-input text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={auth.status === 'loading'}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            {auth.status === 'loading' ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-900 text-center text-xs text-slate-500 flex justify-between items-center">
          <span>Don't have an account?</span>
          <Link
            to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}
            className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

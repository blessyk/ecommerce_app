import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'
import { UserPlus, Mail, Lock, User, ShieldAlert, Loader2 } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user') // user | admin
  const [submitting, setSubmitting] = useState(false)
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/auth/register', { name, email, password, role })
      toast.success('Registration successful! Please sign in.')
      navigate(redirect !== '/' ? `/login?redirect=${redirect}` : '/login')
    } catch (err) {
      console.error('Registration error:', err)
      toast.error(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setSubmitting(false)
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
            <UserPlus size={26} />
          </div>
          <h2 className="text-2xl font-black text-white">Create Account</h2>
          <p className="text-xs text-slate-500">
            Sign up to build your profile, save orders, and receive custom recommendations.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <User size={13} />
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full glass-input text-sm"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              Password (min 6 characters)
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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <ShieldAlert size={13} />
              Select Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full glass-input text-sm bg-slate-900 focus:outline-none"
            >
              <option value="user">User (Standard Buyer)</option>
              <option value="admin">Admin (Inventory Manager)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Creating Profile...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-900 text-center text-xs text-slate-500 flex justify-between items-center">
          <span>Already registered?</span>
          <Link
            to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}
            className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

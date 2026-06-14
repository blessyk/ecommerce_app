import { useState } from 'react'
import { toast } from 'react-toastify'
import { Send, Mail, Phone, MapPin, ShieldQuestion, Globe, MessageSquare } from 'lucide-react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error('Please fill in all form fields.')
      return
    }

    setSending(true)
    setTimeout(() => {
      toast.success('Your message has been dispatched successfully! We will get back to you shortly.')
      setName('')
      setEmail('')
      setMessage('')
      setSending(false)
    }, 1000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="text-indigo-400" size={28} />
          Contact Support
        </h1>
        <p className="text-xs text-slate-500">
          Have questions about our neural recommendation algorithm or need billing help?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Contact Form */}
        <form onSubmit={submit} className="lg:col-span-3 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-200 border-b border-slate-900 pb-2">
            Send Us a Message
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Your Name</label>
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
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
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
            <label className="text-xs font-semibold text-slate-400">Inquiry Details</label>
            <textarea
              required
              rows="5"
              className="w-full glass-input text-sm resize-none"
              placeholder="Type your message details here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send size={13} />
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Right Side: Office Contact Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-slate-200 border-b border-slate-900 pb-2">
              Contact Details
            </h2>

            <div className="space-y-4 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-semibold text-slate-200 block">Headquarters</span>
                  100 Innovation Way, Suite 400<br />
                  Silicon Valley, CA 94025
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-indigo-400 shrink-0" size={16} />
                <div>
                  <span className="font-semibold text-slate-200 block">Support Email</span>
                  support@auracart.io
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-indigo-400 shrink-0" size={16} />
                <div>
                  <span className="font-semibold text-slate-200 block">Direct Line</span>
                  +1 (800) 555-AURA
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="text-indigo-400 shrink-0" size={16} />
                <div>
                  <span className="font-semibold text-slate-200 block">Operating Hours</span>
                  Mon - Fri, 9:00 AM - 6:00 PM EST
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ note panel */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldQuestion className="text-indigo-400 shrink-0 mt-0.5" size={18} />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Looking for immediate answers?</span>
              Visit our customer help center portal to view common delivery timelines, return guidelines, and account configurations.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute({ children }) {
  const auth = useSelector((s) => s.auth)
  if (!auth.user) return <Navigate to="/login" replace />
  if (auth.user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

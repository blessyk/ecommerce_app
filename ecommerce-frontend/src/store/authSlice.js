import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const res = await api.post('/auth/login', credentials)
  const { token } = res.data
  localStorage.setItem('token', token)
  // fetch profile
  const profileRes = await api.get('/users/profile')
  const user = profileRes.data
  localStorage.setItem('user', JSON.stringify(user))
  return { token, user }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData) => {
  const res = await api.put('/users/profile', userData)
  const user = res.data
  localStorage.setItem('user', JSON.stringify(user))
  return user
})

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async () => {
  await api.delete('/users/profile')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  return null
})

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(login.fulfilled, (s, action) => {
        s.status = 'succeeded'
        s.user = action.payload.user
        s.token = action.payload.token
      })
      .addCase(login.rejected, (s) => {
        s.status = 'failed'
      })
      .addCase(updateProfile.fulfilled, (s, action) => {
        s.user = action.payload
      })
      .addCase(deleteAccount.fulfilled, (s) => {
        s.user = null
        s.token = null
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

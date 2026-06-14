import { createSlice } from '@reduxjs/toolkit'

const initialState = JSON.parse(localStorage.getItem('cart')) || { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload
      const exists = state.items.find((i) => i._id === item._id)
      if (exists) {
        exists.qty = (exists.qty || 1) + (item.qty || 1)
      } else {
        state.items.push({ ...item, qty: item.qty || 1 })
      }
      localStorage.setItem('cart', JSON.stringify(state))
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state))
    },
    updateQuantity(state, action) {
      const { id, qty } = action.payload
      const item = state.items.find((i) => i._id === id)
      if (item) {
        item.qty = Math.max(1, qty)
      }
      localStorage.setItem('cart', JSON.stringify(state))
    },
    clearCart(state) {
      state.items = []
      localStorage.setItem('cart', JSON.stringify(state))
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

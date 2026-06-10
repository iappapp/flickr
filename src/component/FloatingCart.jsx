import React from 'react'
import { useNavigate } from 'react-router-dom'
import './FloatingCart.css'
import { useCart } from '../context/CartContext'

export default function FloatingCart(){
  const { items } = useCart()
  const navigate = useNavigate()

  return (
    <div className="floating-cart-root">
      <button className="floating-cart-btn" onClick={() => navigate('/cart')}>
        <div className="cart-icon">🛒</div>
        <div className="cart-count">{items.reduce((s,i)=>s+i.qty,0)}</div>
      </button>
    </div>
  )
}

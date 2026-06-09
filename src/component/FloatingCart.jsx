import React, { useState } from 'react'
import './FloatingCart.css'
import { useCart } from '../context/CartContext'

export default function FloatingCart(){
  const { items, addItem, removeItem, total } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <div className="floating-cart-root">
      {open && (
        <div className="cart-sheet">
          <div className="cart-items">
            {items.length === 0 && <div className="empty">购物车为空</div>}
            {items.map(item=> (
              <div className="cart-row" key={item.id}>
                <div className="cart-row-left">
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-price">￥{item.price}</div>
                </div>
                <div className="cart-controls">
                  <button onClick={()=>removeItem(item.id)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={()=>addItem(item)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">合计: ￥{total.toFixed(2)}</div>
            <button className="checkout">去结算</button>
          </div>
        </div>
      )}

      <button className="floating-cart-btn" onClick={()=>setOpen(o=>!o)}>
        <div className="cart-icon">🛒</div>
        <div className="cart-count">{items.reduce((s,i)=>s+i.qty,0)}</div>
      </button>
    </div>
  )
}

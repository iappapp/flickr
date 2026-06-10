import React from 'react'
import { useCart } from '../context/CartContext'
import './CartPage.css'

export default function CartPage() {
  const { items, addItem, removeItem, removeLine, clear, total } = useCart()

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h2>购物车详情</h2>
        <button className="cart-clear" onClick={clear}>清空购物车</button>
      </header>

      <div className="cart-list">
        {items.length === 0 ? (
          <div className="cart-empty">购物车暂无商品，去菜单页面添加喜欢的饮品。</div>
        ) : (
          items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-left">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-desc">{item.desc}</div>
              </div>
              <div className="cart-item-right">
                <div className="cart-item-price">￥{item.priceValue.toFixed(2)}</div>
                <div className="cart-qty-controls">
                  <button type="button" onClick={() => removeItem(item.id)}>-</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => addItem(item)}>+</button>
                </div>
                <button className="cart-remove" type="button" onClick={() => removeLine(item.id)}>
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="cart-footer">
        <div className="cart-summary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>总计：</span>
          <strong>￥{total.toFixed(2)}</strong>
        </div>
        <button type="button" className="cart-checkout" disabled={items.length === 0} style={{width: '120px'}}>
          去结算
        </button>
      </footer>
    </div>
  )
}

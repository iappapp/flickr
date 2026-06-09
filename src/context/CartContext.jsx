import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function useCart(){
  return useContext(CartContext)
}

export function CartProvider({ children }){
  const [items, setItems] = useState([])

  function addItem(product){
    setItems((prev)=>{
      const idx = prev.findIndex(i=>i.id===product.id)
      if(idx>=0){
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }
        return copy
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function removeItem(productId){
    setItems((prev)=>{
      const idx = prev.findIndex(i=>i.id===productId)
      if(idx === -1) return prev
      const copy = [...prev]
      if(copy[idx].qty > 1){
        copy[idx] = { ...copy[idx], qty: copy[idx].qty - 1 }
        return copy
      }
      copy.splice(idx,1)
      return copy
    })
  }

  function clear(){ setItems([]) }

  const total = items.reduce((s,i)=>s + (i.price||0) * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext

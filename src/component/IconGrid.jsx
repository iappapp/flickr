import React from 'react'
import './IconGrid.css'

const items = [
  ['我的订单','🧾'],
  ['咖啡卡券','💳'],
  ['优惠券','🎟️'],
  ['招商加盟','🏪'],
  ['租赁合作','🏠'],
]

export default function IconGrid(){
  return (
    <div className="icon-grid">
      {items.map(([label,icon])=> (
        <div key={label} className="icon-item">
          <div className="icon">{icon}</div>
          <div className="label">{label}</div>
        </div>
      ))}
    </div>
  )
}

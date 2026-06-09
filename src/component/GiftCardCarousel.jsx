import React from 'react'
import './GiftCardCarousel.css'

const cards = [1,2]

export default function GiftCardCarousel(){
  return (
    <div className="gift-carousel">
      {cards.map((c)=> (
        <div key={c} className="gift-card"> 
          <div className="gift-img">礼品卡 {c}</div>
        </div>
      ))}
    </div>
  )
}

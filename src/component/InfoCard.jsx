import React from 'react'
import './InfoCard.css'

export default function InfoCard() {
  return (
    <div className="info-card">
      <div className="info-left">
        <div className="welcome">欢迎~Luckin新朋友</div>
        <div className="points">0 <span className="unit">/0</span></div>
      </div>
      <div className="info-right">去喝一杯，加入luckin &gt;</div>
    </div>
  )
}

import React from 'react'
import './OrdersPreview.css'

export default function OrdersPreview(){
  return (
    <div className="orders-preview">
      <div className="orders-header">
        <div className="title">送礼品卡</div>
        <div className="link">查看全部 &gt;</div>
      </div>
      <div className="orders-empty">暂无最近订单</div>
    </div>
  )
}

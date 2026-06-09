import React from 'react'
import './ProfileHeader.css'

export default function ProfileHeader() {
  // Minimal placeholder header; will be replaced with real auth hook later
  const loggedIn = false
  const user = { name: '未登录', subtitle: '点击登录查看会员权益' }

  return (
    <div className="profile-header">
      <div className="avatar">☕</div>
      <div className="meta">
        <div className="name">{loggedIn ? user.name : '未登录'}</div>
        <div className="subtitle">{user.subtitle}</div>
      </div>
      <button className="login-btn">登录</button>
    </div>
  )
}

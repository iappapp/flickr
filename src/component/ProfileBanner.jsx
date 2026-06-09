import React from 'react'
import './ProfileBanner.css'

export default function ProfileBanner() {
  return (
    <div className="profile-banner">
      <div className="banner-bg" />
      <div className="banner-content">
        <div className="left">
          <div className="avatar">🐮</div>
          <div className="login-text">登录/注册 &gt;</div>
        </div>
        <div className="right-icons">● ● | ○</div>
      </div>
    </div>
  )
}

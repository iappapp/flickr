import React, { useState } from 'react';
import './App.css';

export default function Login() {
  const [active, setActive] = useState('sms'); // 'password' or 'sms'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [pwd, setPwd] = useState('');
  const [message, setMessage] = useState('');

  const getCode = () => {
    // simulate sending code
    setMessage('验证码已发送（模拟）。');
    setTimeout(() => setMessage(''), 2500);
  };

  const submit = (e) => {
    e.preventDefault();
    setMessage('登录提交（模拟）');
  };

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="login-bg-blob login-bg-blob-1"></div>
      <div className="login-bg-blob login-bg-blob-2"></div>
      <div className="login-bg-blob login-bg-blob-3"></div>

      <div className="login-container-modern">
        {/* Left branding section */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="brand-title">欢迎回来</h1>
            <p className="brand-subtitle">登录您的账户，探索更多精彩内容</p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>安全可靠</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>极速体验</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>专属福利</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form section */}
        <div className="login-form-section">
          <div className="form-header">
            <h2 className="form-title">账户登录</h2>
            <p className="form-desc">使用您的手机号或账号登录</p>
          </div>

          <div className="tabs-modern">
            <button 
              className={`tab-modern ${active === 'sms' ? 'tab-active' : ''}`} 
              onClick={() => setActive('sms')}
            >
              短信登录
            </button>
            <button 
              className={`tab-modern ${active === 'password' ? 'tab-active' : ''}`} 
              onClick={() => setActive('password')}
            >
              密码登录
            </button>
          </div>

          <form onSubmit={submit} className="login-form-modern">
            <div className="input-group">
              <label className="input-label">手机号</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="18" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div className="phone-prefix">+86</div>
                <input 
                  type="tel"
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="请输入手机号"
                  className="form-input-modern"
                />
              </div>
            </div>

            {active === 'password' ? (
              <div className="input-group">
                <label className="input-label">密码</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    value={pwd} 
                    onChange={e => setPwd(e.target.value)} 
                    placeholder="请输入密码"
                    className="form-input-modern"
                  />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label">验证码</label>
                <div className="input-wrapper code-wrapper">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 12V10C20 9.44772 19.5523 9 19 9H5C4.44772 9 4 9.44772 4 10V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <rect x="8" y="12" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M10 4H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <input 
                    type="text"
                    value={code} 
                    onChange={e => setCode(e.target.value)} 
                    placeholder="请输入验证码"
                    className="form-input-modern"
                  />
                  <button type="button" className="code-btn-modern" onClick={getCode}>
                    获取验证码
                  </button>
                </div>
              </div>
            )}

            {message && <div className="msg-modern">{message}</div>}

            <button className="login-btn-modern" type="submit">
              <span>登录</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          <div className="divider-modern">
            <span>其他登录方式</span>
          </div>

          <div className="social-login-modern">
            <button className="social-btn-modern wechat-btn" type="button">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.492.492 0 01.177-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zM14.54 13.21c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
              </svg>
              <span>微信登录</span>
            </button>
            <button className="social-btn-modern qq-btn" type="button">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span>QQ登录</span>
            </button>
          </div>

          <div className="form-footer-modern">
            <a href="#" className="footer-link-modern">忘记密码？</a>
            <a href="#" className="footer-link-modern primary">立即注册</a>
          </div>
        </div>
      </div>
    </div>
  );
}

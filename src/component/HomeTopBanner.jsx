import React from 'react';
import './HomeTopBanner.css';

export default function HomeTopBanner() {
  return (
    <section className="home-top-banner">
      <div className="home-top-banner__glass">
        <span>NEW</span>
      </div>
      <div className="home-top-banner__content">
        <div className="home-top-banner__main">
          <div className="home-top-banner__title">水果茉莉冰奶系列</div>
          <div className="home-top-banner__subtitle">夏日上新 · 轻负担好喝</div>
          <button type="button" className="home-top-banner__button">立即品尝</button>
        </div>
        <div className="home-top-banner__visual">
          <div className="home-top-banner__drink drink--pink">苹果茉莉超大杯</div>
          <div className="home-top-banner__drink drink--yellow">小青桔茉莉冰奶</div>
        </div>
      </div>
    </section>
  );
}

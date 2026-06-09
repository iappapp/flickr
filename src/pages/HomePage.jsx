import React, { useState } from 'react';
import './HomePage.css';
import HomeTopBanner from '../component/HomeTopBanner';
import HomeFunctionGrid from '../component/HomeFunctionGrid';
import HomeAdSection from '../component/HomeAdSection';
import MenuPage from './MenuPage';
import BottomTabBar from '../component/BottomTabBar';

const tabs = [
  { key: 'home', title: '首页', icon: 'home' },
  { key: 'menu', title: '菜单', icon: 'menu' },
  { key: 'card', title: '会员卡', icon: 'card' },
  { key: 'mine', title: '我的', icon: 'mine' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="home-page">
      <div className="home-page__content">
        {activeTab === 'home' && (
          <>
            <HomeTopBanner />
            <HomeFunctionGrid />
            <HomeAdSection />
          </>
        )}
        {activeTab === 'menu' && <MenuPage />}
        {!['home', 'menu'].includes(activeTab) && (
          <div className="home-page__placeholder">
            <div className="home-page__placeholder-title">{tabs.find((tab) => tab.key === activeTab)?.title}</div>
            <div className="home-page__placeholder-copy">正在建设中，敬请期待更多瑞幸体验</div>
          </div>
        )}
      </div>
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

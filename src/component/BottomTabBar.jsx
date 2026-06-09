import React from 'react';
import { Button } from 'tdesign-react';
import './BottomTabBar.css';

const tabItems = [
  { key: 'home', label: '首页', icon: '🏠' },
  { key: 'menu', label: '菜单', icon: '📋' },
  { key: 'card', label: '会员卡', icon: '💳' },
  { key: 'mine', label: '我的', icon: '👤' },
];

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <div className="bottom-tab-bar">
      <div className="bottom-tab-bar__container">
        {tabItems.map((item) => (
          <Button
            key={item.key}
            theme={activeTab === item.key ? 'primary' : 'default'}
            variant="text"
            className={`bottom-tab-bar__item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => onTabChange(item.key)}
          >
            <span className="bottom-tab-bar__icon">{item.icon}</span>
            <span className="bottom-tab-bar__label">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

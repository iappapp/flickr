import React from 'react';
import {
  ShopOutlined,
  CarOutlined,
  CoffeeOutlined,
  GiftOutlined,
  CreditCardOutlined,
  CrownOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import './HomeFunctionGrid.css';

const features = [
  { key: 'pickup', icon: <ShopOutlined />, title: '到店取', subtitle: '提前点单免排队' },
  { key: 'delivery', icon: <CarOutlined />, title: '幸运送', subtitle: '外卖及时送达' },
  { key: 'instant', icon: <CoffeeOutlined />, title: '即享咖啡', subtitle: '与即享看球赛' },
  { key: 'coupon', icon: <GiftOutlined />, title: '咖啡卡券', subtitle: '立享优惠' },
  { key: 'gift', icon: <CreditCardOutlined />, title: '礼品卡', subtitle: '送TA咖啡' },
  { key: 'welfare', icon: <CrownOutlined />, title: '福利中心', subtitle: '天天得福利' },
  { key: 'group', icon: <TeamOutlined />, title: '拼单满减', subtitle: '一起点更划算' },
];

export default function HomeFunctionGrid() {
  return (
    <div className="home-function-grid">
      {features.map((feature) => (
        <button key={feature.key} type="button" className="home-function-grid__item">
          <div className="home-function-grid__icon">{feature.icon}</div>
          <div className="home-function-grid__title">{feature.title}</div>
          <div className="home-function-grid__subtitle">{feature.subtitle}</div>
        </button>
      ))}
    </div>
  );
}

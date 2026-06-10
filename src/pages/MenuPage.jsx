import React, { useState } from 'react';
import './MenuPage.css';
import MenuTopBar from '../component/MenuTopBar';
import MenuCategory from '../component/MenuCategory';
import MenuProductList from '../component/MenuProductList';
import FloatingCart from '../component/FloatingCart'

const categories = [
  { id: 'popular', name: '人气Top', icon: '🔥' },
  { id: 'new-drink', name: '冰奶上新', icon: '❄️' },
  { id: 'hot-sale', name: '大促', icon: '🔴' },
  { id: 'all-ice', name: '全冰去水', icon: '🧊' },
  { id: 'new-around', name: '周边NEW', icon: '✨' },
  { id: 'flavor-hold', name: '风味拿铁', icon: '☕' },
  { id: 'hot-drink', name: '爆饮', icon: '🔥' },
  { id: 'small-yellow', name: '小黄油系列', icon: '🟡' },
  { id: 'light-tea', name: '轻乳茶', icon: '🍵' },
  { id: 'american', name: '美式家族', icon: '🇺🇸' },
  { id: 'fruit-c', name: '果C美式', icon: '🍊' },
  { id: 'coconut', name: '生椰家族', icon: '🥥' },
  { id: 'master-coffee', name: '大师咖啡', icon: '👨‍🍳' },
];

const products = {
  popular: [
    {
      id: 1,
      name: '生椰拿铁（首创）',
      tags: ['全球销量第一', '瑞幸专属生椰岛'],
      desc: '累计销量超21亿杯 | IIAC金奖',
      price: '¥10.9',
      originalPrice: '¥20',
      sales: 2100000000,
      image: '🥥☕',
    },
    {
      id: 2,
      name: '现夏之梦',
      tags: ['精选埃塞豆夏咖啡', 'NFC荔枝汁'],
      desc: '层次丰富，一杯充盈花果香',
      price: '¥11.9',
      originalPrice: '¥20',
      image: '🌸☕',
    },
    {
      id: 3,
      name: '小青桔茉莉冰奶',
      tags: ['鲜果现榨', '100%鲜草泡茶'],
      desc: '入口酸甜鲜爽，清新舒爽',
      price: '¥9.9',
      originalPrice: '¥19',
      image: '🍋☕',
    },
    {
      id: 4,
      name: '葡萄茉莉冰奶',
      tags: ['24h急速冷藏锁鲜', '城市限定'],
      desc: '真实葡萄果肉，奶香茶香甜蜜蜜',
      price: '¥9.9',
      originalPrice: '¥19',
      image: '🍇☕',
    },
  ],
  'new-drink': [
    {
      id: 5,
      name: '杨梅冰奶',
      tags: ['夏日新品'],
      desc: '酸酸甜甜很清爽',
      price: '¥10.9',
      originalPrice: '¥20',
      image: '🫐☕',
    },
    {
      id: 6,
      name: '蓝莓冰奶',
      tags: ['夏日新品'],
      desc: '高级蓝紫色，香气馥郁',
      price: '¥11.9',
      originalPrice: '¥22',
      image: '🫐☕',
    },
  ],
  'hot-sale': [
    {
      id: 7,
      name: '椰子拿铁',
      tags: ['大促'],
      desc: '椰香十足，醇厚顺滑',
      price: '¥8.8',
      originalPrice: '¥18',
      image: '🥥☕',
    },
  ],
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [store, setStore] = useState('东山弄店');

  return (
      <div className="menu-page">
        <MenuTopBar
          deliveryType={deliveryType}
          onDeliveryTypeChange={setDeliveryType}
          store={store}
          onStoreChange={setStore}
        />
        <div className="menu-page__body">
          <div className="menu-page__left">
            <MenuCategory
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
          <div className="menu-page__right">
            <MenuProductList products={products[selectedCategory] || []} />
          </div>
        </div>
        <FloatingCart />
      </div>
  )
}

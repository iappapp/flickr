import React from 'react';
import './HomeAdSection.css';

const cards = [
  { id: 't1', title: '9.9元 x 3张饮品券', description: '加幸运官 好礼周周领', color: 'blue' },
  { id: 't2', title: '邀请好友得20元', description: '新人首杯专属福利', color: 'orange' },
];

export default function HomeAdSection() {
  return (
    <section className="home-ad-section">
      <div className="home-ad-section__row">
        {cards.map((card) => (
          <div key={card.id} className={`home-ad-card home-ad-card--half home-ad-card--${card.color}`}>
            <div className="home-ad-card__title">{card.title}</div>
            <div className="home-ad-card__subtitle">{card.description}</div>
          </div>
        ))}
      </div>
      <div className="home-ad-section__row home-ad-section__row--grid">
        <div className="home-ad-card home-ad-card--square">
          <div className="home-ad-card__title">买咖啡得斯拉徽章</div>
          <div className="home-ad-card__subtitle">限时好礼，速来参与</div>
        </div>
        <div className="home-ad-card home-ad-card--half home-ad-card--purple home-ad-card--tall">
          <div className="home-ad-card__title">会员权益加码</div>
          <div className="home-ad-card__subtitle">专属折扣、补贴福利</div>
        </div>
      </div>
    </section>
  );
}

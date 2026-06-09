import React from 'react';
import './MenuCategory.css';

export default function MenuCategory({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="menu-category">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`menu-category__item ${selectedCategory === cat.id ? 'active' : ''}`}
          onClick={() => onCategorySelect(cat.id)}
          title={cat.name}
        >
          <span className="menu-category__icon">{cat.icon}</span>
          <span className="menu-category__label">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}

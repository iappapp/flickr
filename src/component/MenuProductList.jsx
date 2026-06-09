import React from 'react';
import './MenuProductList.css';
import { useCart } from '../context/CartContext'

export default function MenuProductList({ products }) {
  const { addItem } = useCart()
  return (
    <div className="menu-product-list">
      {products.map((product) => (
        <div key={product.id} className="menu-product-card">
          <div className="menu-product-card__image">{product.image}</div>
          <div className="menu-product-card__content">
            <div className="menu-product-card__header">
              <h3 className="menu-product-card__title">{product.name}</h3>
              <button type="button" className="menu-product-card__add" onClick={() => addItem(product)}>+</button>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="menu-product-card__tags">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="menu-product-card__tag">{tag}</span>
                ))}
              </div>
            )}
            <p className="menu-product-card__desc">{product.desc}</p>
            <div className="menu-product-card__footer">
              <div className="menu-product-card__price">
                <span className="menu-product-card__current">{product.price}</span>
                {product.originalPrice && (
                  <span className="menu-product-card__original">{product.originalPrice}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

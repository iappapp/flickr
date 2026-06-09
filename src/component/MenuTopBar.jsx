import React from 'react';
import { Button } from 'tdesign-react';
import './MenuTopBar.css';

export default function MenuTopBar({ deliveryType, onDeliveryTypeChange, store, onStoreChange }) {
  return (
    <div className="menu-top-bar">
      <div className="menu-top-bar__tabs">
        <Button
          size="small"
          theme={deliveryType === 'pickup' ? 'primary' : 'default'}
          variant={deliveryType === 'pickup' ? 'base' : 'outline'}
          onClick={() => onDeliveryTypeChange('pickup')}
        >
          自提
        </Button>
        <Button
          size="small"
          theme={deliveryType === 'delivery' ? 'primary' : 'default'}
          variant={deliveryType === 'delivery' ? 'base' : 'outline'}
          onClick={() => onDeliveryTypeChange('delivery')}
        >
          外送
        </Button>
      </div>

      <div className="menu-top-bar__store">
        <span className="menu-top-bar__store-icon">📍</span>
        <span>{store}</span>
        <span className="menu-top-bar__store-dist">225m</span>
      </div>

      <Button size="small" theme="primary" variant="outline">
        拼单
      </Button>
    </div>
  );
}

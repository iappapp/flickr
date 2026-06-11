import React from 'react';
import './LocationSidebar.css';

export default function LocationSidebar({
  locations,
  selectedId,
  favorites,
  onSelect,
  onToggleFavorite,
}) {
  // Only show favorited locations in the sidebar
  const favCities = locations.filter((l) => favorites.includes(l.id));

  return (
    <div className="location-sidebar">
      <div className="location-sidebar__title">收藏</div>

      {favCities.map((city) => {
        const isFav = favorites.includes(city.id);
        return (
          <div
            key={city.id}
            className={`location-sidebar__item${
              city.id === selectedId ? ' location-sidebar__item--active' : ''
            }`}
            onClick={() => onSelect(city.id)}
          >
            <span className="location-sidebar__icon">{city.conditionIcon}</span>
            <span className="location-sidebar__name">{city.name}</span>
            <span className="location-sidebar__temp">{city.temp}°</span>
            <span className="location-sidebar__range">
              H:{city.high}° L:{city.low}°
            </span>
            <span
              className={`location-sidebar__star${
                isFav ? ' location-sidebar__star--active' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(city.id);
              }}
              title="取消收藏"
            >
              ★
            </span>
          </div>
        );
      })}

      {favCities.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '20px 8px', opacity: 0.35, fontSize: 12,
        }}>
          暂无收藏<br/>点击 ⋯ 添加
        </div>
      )}
    </div>
  );
}

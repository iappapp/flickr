import React, { useState, useMemo } from 'react';
import './LocationDrawer.css';

export default function LocationDrawer({
  open,
  onClose,
  locations,
  selectedId,
  favorites,
  onSelect,
  onToggleFavorite,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return locations;
    const q = search.toLowerCase();
    return locations.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.condition.toLowerCase().includes(q)
    );
  }, [locations, search]);

  const favList = useMemo(
    () => filtered.filter((l) => favorites.includes(l.id)),
    [filtered, favorites]
  );

  const otherList = useMemo(
    () => filtered.filter((l) => !favorites.includes(l.id)),
    [filtered, favorites]
  );

  /* close on Escape */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const renderCity = (city) => {
    const isFav = favorites.includes(city.id);
    return (
      <div
        key={city.id}
        className={`drawer__city${city.id === selectedId ? ' drawer__city--active' : ''}`}
        onClick={() => { onSelect(city.id); onClose(); }}
      >
        <span className="drawer__city-icon">{city.conditionIcon}</span>
        <div className="drawer__city-info">
          <div className="drawer__city-name">{city.name}</div>
          <div className="drawer__city-condition">{city.condition}</div>
        </div>
        <div className="drawer__city-temp">
          <div>{city.temp}°</div>
          <div className="drawer__city-temp-range">
            H:{city.high}° L:{city.low}°
          </div>
        </div>
        <span
          className={`drawer__star${isFav ? ' drawer__star--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(city.id);
          }}
          title={isFav ? '取消收藏' : '收藏'}
        >
          {isFav ? '★' : '☆'}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay${open ? ' drawer-overlay--open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className={`drawer${open ? ' drawer--open' : ''}`}>
        <div className="drawer__header">
          <span className="drawer__title">地点</span>
          <span className="drawer__close" onClick={onClose}>✕</span>
        </div>

        <div className="drawer__search">
          <span className="drawer__search-icon">🔍</span>
          <input
            className="drawer__search-input"
            placeholder="搜索城市…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="drawer__list">
          {favList.length > 0 && (
            <>
              <div className="drawer__section-label">收藏</div>
              {favList.map(renderCity)}
            </>
          )}

          {otherList.length > 0 && (
            <>
              {favList.length > 0 && <div className="drawer__section-label">全部</div>}
              {otherList.map(renderCity)}
            </>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.4, fontSize: 14 }}>
              未找到匹配的城市
            </div>
          )}
        </div>
      </div>
    </>
  );
}

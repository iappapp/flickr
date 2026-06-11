import React from 'react';
import './WeatherHeader.css';

export default function WeatherHeader({ location, onShare, onMore }) {
  return (
    <div className="weather-header">
      <div className="weather-header__location">
        <span>{location}</span>
      </div>
      <div className="weather-header__actions">
        <span className="weather-header__action" onClick={onShare}>↗</span>
        <span className="weather-header__action" onClick={onMore}>⋯</span>
      </div>
    </div>
  );
}

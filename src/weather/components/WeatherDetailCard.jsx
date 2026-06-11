import React from 'react';
import './WeatherDetailCard.css';

export default function WeatherDetailCard({ label, value, unit, sub, progress, progressLabel, icon }) {
  return (
    <div className="weather-detail-card">
      <span className="weather-detail-card__label">
        {icon && <span className="weather-detail-card__icon">{icon}</span>}
        {label}
      </span>
      <span className="weather-detail-card__value">
        {value}
        {unit && <span className="weather-detail-card__unit">{unit}</span>}
      </span>
      {sub && <span className="weather-detail-card__sub">{sub}</span>}
      {progress !== undefined && (
        <div className="weather-detail-card__bar-wrap">
          <div className="weather-detail-card__bar">
            <div className="weather-detail-card__bar-fill" style={{ width: `${progress}%` }} />
          </div>
          {progressLabel && (
            <div className="weather-detail-card__bar-labels">
              <span>0</span>
              <span>{progressLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

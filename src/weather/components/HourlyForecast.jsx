import React from 'react';
import './HourlyForecast.css';

export default function HourlyForecast({ label, hours }) {
  return (
    <div className="hourly-forecast">
      <div className="hourly-forecast__label">{label}</div>
      <div className="hourly-forecast__scroll">
        {hours.map((h, i) => (
          <div
            className={`hourly-forecast__item${h.isNow ? ' hourly-forecast__item--now' : ''}`}
            key={i}
          >
            <span className="hourly-forecast__time">{h.time}</span>
            <span className="hourly-forecast__icon">{h.icon}</span>
            <span className="hourly-forecast__temp">{h.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

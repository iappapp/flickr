import React from 'react';
import './CurrentWeather.css';

export default function CurrentWeather({ date, lunarDate, temperature, condition, high, low }) {
  return (
    <div className="current-weather">
      <div className="current-weather__date">{date} · {lunarDate}</div>
      <div className="current-weather__temp">{temperature}</div>
      <div className="current-weather__condition">{condition}</div>
      <div className="current-weather__range">
        <span className="current-weather__range-high">{high}°</span>
        <span className="current-weather__range-sep">/</span>
        <span>{low}°</span>
      </div>
    </div>
  );
}

import React from 'react';
import WeatherDetailCard from './WeatherDetailCard';
import './WeatherDetailGrid.css';

export default function WeatherDetailGrid({ details }) {
  return (
    <div className="weather-detail-grid">
      {details.map((d, i) => (
        <WeatherDetailCard key={i} {...d} />
      ))}
    </div>
  );
}

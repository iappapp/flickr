import React from 'react';
import './DailyForecast.css';

export default function DailyForecast({ label, days, minTemp, maxTemp }) {
  const range = maxTemp - minTemp || 1;
  return (
    <div className="daily-forecast">
      <div className="daily-forecast__label">{label}</div>
      <div className="daily-forecast__list">
        {days.map((d, i) => {
          const left = ((d.low - minTemp) / range) * 100;
          const width = ((d.high - d.low) / range) * 100;
          return (
            <div className="daily-forecast__item" key={i}>
              <span className="daily-forecast__day">{d.day}</span>
              <span className="daily-forecast__icon-wrap">{d.icon}</span>
              {d.rain !== undefined && (
                <span className={`daily-forecast__rain${d.rain > 0 ? ' daily-forecast__rain--blue' : ''}`}>
                  {d.rain}%
                </span>
              )}
              {d.rain === undefined && <span className="daily-forecast__rain" />}
              <div className="daily-forecast__range">
                <span className="daily-forecast__low">{d.low}°</span>
                <div className="daily-forecast__bar">
                  <div
                    className="daily-forecast__bar-fill"
                    style={{ left: `${left}%`, width: `${Math.max(width, 8)}%` }}
                  />
                </div>
                <span className="daily-forecast__high">{d.high}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

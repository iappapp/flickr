import React, { useState, useMemo, useCallback } from 'react';
import './WeatherPage.css';
import WeatherHeader from './components/WeatherHeader';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetailGrid from './components/WeatherDetailGrid';
import LocationSidebar from './components/LocationSidebar';
import locations from './locations';

/* ── Persist favorites to localStorage ── */
const FAV_KEY = 'weather_favorites';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : ['nyc', 'beijing', 'tokyo'];
  } catch { return ['nyc', 'beijing', 'tokyo']; }
}

function saveFavorites(ids) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); } catch {}
}

/* ── Derive background class from weather condition ── */
function getWeatherClass(condition, hour) {
  if (hour >= 19 || hour <= 5) return 'weather-page--night';
  const map = {
    '大部晴朗': 'weather-page--sunny',
    '晴': 'weather-page--sunny',
    '多云': 'weather-page--cloudy',
    '阴': 'weather-page--cloudy',
    '雨': 'weather-page--rainy',
    '雪': 'weather-page--cloudy',
  };
  return map[condition] || 'weather-page--sunny';
}

export default function WeatherPage() {
  const [selectedId, setSelectedId] = useState('nyc');
  const [favorites, setFavorites] = useState(loadFavorites);

  /* ── Current location data ── */
  const city = useMemo(
    () => locations.find((l) => l.id === selectedId) || locations[0],
    [selectedId]
  );

  const minTemp = useMemo(
    () => Math.min(...city.daily.map((d) => d.low)),
    [city]
  );
  const maxTemp = useMemo(
    () => Math.max(...city.daily.map((d) => d.high)),
    [city]
  );

  const weatherClass = useMemo(() => {
    const hour = new Date().getHours();
    return getWeatherClass(city.condition, hour);
  }, [city.condition]);

  /* ── Handlers ── */
  const handleToggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      saveFavorites(next);
      return next;
    });
  }, []);

  return (
    <div className={`weather-page ${weatherClass}`}>
      {/* ── Three‑column layout ── */}
      <div className="weather-page__layout">

        {/* ── Col 1: favorite sidebar ── */}
        <LocationSidebar
          locations={locations}
          selectedId={selectedId}
          favorites={favorites}
          onSelect={setSelectedId}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* ── Col 2: forecasts ── */}
        <div className="weather-page__middle">
          <WeatherHeader location={city.name} />

          <div className="weather-page__section">
            <div className="weather-frosted">
              <HourlyForecast label="24小时预报" hours={city.hourly} />
            </div>
          </div>

          <div className="weather-page__section">
            <div className="weather-frosted">
              <DailyForecast
                label="10日预报"
                days={city.daily}
                minTemp={minTemp}
                maxTemp={maxTemp}
              />
            </div>
          </div>
        </div>

        {/* ── Col 3: current weather + detail cards ── */}
        <div className="weather-page__right">
          <CurrentWeather
            date={city.date}
            lunarDate={city.lunarDate}
            temperature={String(city.temp)}
            condition={city.condition}
            high={String(city.high)}
            low={String(city.low)}
          />

          <WeatherDetailGrid details={city.details} />
        </div>

      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCurrent, fetchForecast } from '../api/weatherApi';
import {
  DEFAULT_CITY_LABEL,
  DEFAULT_QUERY,
  FORECAST_CACHE_TTL_MS,
  hasApiKey,
} from '../config';
import { mergeCurrent, toUiModel } from '../mappers/toUiModel';
import locations from '../locations';

const CACHE_KEY = 'weather_forecast_cache_v1';

function mockCityToUi(city) {
  return {
    ...city,
    q: city.name,
    conditionIcon: null,
    conditionEmoji: city.conditionIcon || '🌤️',
    hourly: (city.hourly || []).map((h) => ({
      ...h,
      icon: null,
      iconEmoji: h.icon || '☁️',
    })),
    daily: (city.daily || []).map((d) => ({
      ...d,
      icon: null,
      iconEmoji: d.icon || '☀️',
    })),
  };
}

function getMockFallback(q) {
  const raw = String(q || '');
  const lower = raw.toLowerCase();
  const found =
    locations.find((l) => l.id === lower || l.name === raw) ||
    locations.find((l) => lower.includes(l.id) || raw.includes(l.name)) ||
    locations.find((l) => l.id === 'beijing') ||
    locations[0];
  return mockCityToUi(found);
}

async function readCache(q) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.q || parsed.q !== q) return null;
    if (Date.now() - (parsed.ts || 0) > FORECAST_CACHE_TTL_MS) return null;
    return parsed.model || null;
  } catch {
    return null;
  }
}

async function writeCache(q, model) {
  try {
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ q, model, ts: Date.now() }),
    );
  } catch {
    // ignore
  }
}

/**
 * Load forecast for selected query; Current API for pull-to-refresh.
 */
export function useWeather(selected) {
  const query = selected?.q || DEFAULT_QUERY;
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  const loadForecast = useCallback(async (q, { silent } = {}) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    if (!hasApiKey()) {
      const mock = getMockFallback(q);
      setCity(mock);
      setUsingMock(true);
      setError('未配置 API Key，已显示示例数据');
      setLoading(false);
      return mock;
    }

    try {
      const data = await fetchForecast(q);
      const model = toUiModel(data);
      model.q = q;
      setCity(model);
      setUsingMock(false);
      setError(null);
      await writeCache(q, model);
      return model;
    } catch (e) {
      const cached = await readCache(q);
      if (cached) {
        setCity(cached);
        setUsingMock(false);
        setError(`${e?.message || '加载失败'}（已显示缓存）`);
        return cached;
      }
      const mock = getMockFallback(q);
      setCity(mock);
      setUsingMock(true);
      setError(`${e?.message || '加载失败'}（已回退示例数据）`);
      return mock;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast(query);
  }, [query, loadForecast]);

  const refreshCurrent = useCallback(async () => {
    setRefreshing(true);
    try {
      if (!hasApiKey()) {
        await loadForecast(query, { silent: true });
        return;
      }
      const data = await fetchCurrent(query);
      setCity((prev) => {
        if (!prev) return prev;
        return mergeCurrent(prev, data);
      });
      setError(null);
      setUsingMock(false);
    } catch (e) {
      // fall back to full forecast reload
      try {
        await loadForecast(query, { silent: true });
      } catch {
        setError(e?.message || '刷新失败');
      }
    } finally {
      setRefreshing(false);
    }
  }, [query, loadForecast]);

  const reload = useCallback(() => loadForecast(query), [loadForecast, query]);

  return {
    city:
      city ||
      mockCityToUi(
        locations.find((l) => l.id === 'beijing') || locations[0],
      ),
    loading,
    refreshing,
    error,
    usingMock,
    reload,
    refreshCurrent,
    defaultLabel: DEFAULT_CITY_LABEL,
  };
}

export function searchResultToSelection(item) {
  return {
    id: String(item.id),
    name: item.name,
    q: `id:${item.id}`,
    region: item.region,
    country: item.country,
  };
}

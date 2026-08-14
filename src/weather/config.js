/**
 * WeatherAPI configuration.
 * Copy secrets.example.js → secrets.js and put your real key there.
 */
import { WEATHER_API_KEY as KEY_FROM_SECRETS } from './secrets';

export const WEATHER_API_KEY = KEY_FROM_SECRETS || '';

export const BASE_URL = 'https://api.weatherapi.com/v1';

/** Free-tier safe default; raise after upgrading plan */
export const FORECAST_DAYS = 3;

export const LANG = 'zh';

/** Default city query when no favorites / last selection */
export const DEFAULT_QUERY = 'Beijing';

export const DEFAULT_CITY_LABEL = '北京';

/** Cache TTL for last successful forecast (ms) */
export const FORECAST_CACHE_TTL_MS = 30 * 60 * 1000;

export const SEARCH_DEBOUNCE_MS = 300;

export const SEARCH_MIN_CHARS = 1;

export const REQUEST_TIMEOUT_MS = 10000;

export function hasApiKey() {
  return Boolean(WEATHER_API_KEY && WEATHER_API_KEY !== 'YOUR_KEY');
}

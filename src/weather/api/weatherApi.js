import {
  BASE_URL,
  FORECAST_DAYS,
  LANG,
  REQUEST_TIMEOUT_MS,
  WEATHER_API_KEY,
  hasApiKey,
} from '../config';

const ERROR_MESSAGES = {
  1002: '未配置 API Key',
  1003: '未提供地点参数',
  1005: '请求地址无效',
  1006: '未找到匹配地点',
  2006: 'API Key 无效',
  2007: '本月调用配额已用尽',
  2008: 'API Key 已被禁用',
  2009: '当前套餐无权访问该资源',
  9999: '服务内部错误',
};

function buildUrl(path, params = {}) {
  const qs = new URLSearchParams({
    key: WEATHER_API_KEY,
    lang: LANG,
    ...params,
  });
  return `${BASE_URL}${path}?${qs.toString()}`;
}

async function request(path, params = {}) {
  if (!hasApiKey()) {
    const err = { code: 1002, message: ERROR_MESSAGES[1002] };
    throw err;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(buildUrl(path, params), {
      method: 'GET',
      signal: controller.signal,
    });
    const data = await res.json();

    if (data?.error) {
      const code = data.error.code;
      throw {
        code,
        message: ERROR_MESSAGES[code] || data.error.message || '请求失败',
      };
    }

    if (!res.ok) {
      throw { code: res.status, message: `HTTP ${res.status}` };
    }

    return data;
  } catch (e) {
    if (e?.code && e?.message) throw e;
    if (e?.name === 'AbortError') {
      throw { code: -1, message: '请求超时，请检查网络' };
    }
    throw { code: -1, message: e?.message || '网络异常' };
  } finally {
    clearTimeout(timer);
  }
}

/** Search / Autocomplete */
export function searchCities(q) {
  return request('/search.json', { q: String(q).trim() });
}

/** Forecast (includes location + current + forecastday) */
export function fetchForecast(q, days = FORECAST_DAYS) {
  return request('/forecast.json', {
    q: String(q).trim(),
    days: String(days),
    aqi: 'no',
  });
}

/** Current / Realtime — light refresh of current card */
export function fetchCurrent(q) {
  return request('/current.json', { q: String(q).trim() });
}

export { ERROR_MESSAGES };

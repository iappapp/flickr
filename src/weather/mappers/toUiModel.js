function httpsIcon(url) {
  if (!url) return null;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http')) return url;
  return `https://${url}`;
}

function weekdayLabel(dateStr, index) {
  if (index === 0) return '今天';
  if (index === 1) return '明天';
  const d = new Date(`${dateStr}T12:00:00`);
  const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return map[d.getDay()] || dateStr;
}

function formatHourLabel(timeStr, isFirst) {
  if (isFirst) return '现在';
  // "2024-05-20 14:00" → "14时"
  const part = String(timeStr).split(' ')[1] || '';
  const hour = part.slice(0, 2);
  return hour ? `${Number(hour)}时` : timeStr;
}

function uvSub(uv) {
  const n = Number(uv) || 0;
  if (n <= 2) return '低';
  if (n <= 5) return '中等';
  if (n <= 7) return '高';
  if (n <= 10) return '很高';
  return '极端';
}

function buildHourly(forecastdays, localtime) {
  const now = localtime ? new Date(localtime.replace(' ', 'T')) : new Date();
  const nowHour = now.getHours();
  const today = forecastdays?.[0];
  const tomorrow = forecastdays?.[1];
  const hours = [
    ...(today?.hour || []),
    ...(tomorrow?.hour || []),
  ];

  const startIdx = hours.findIndex((h) => {
    const t = String(h.time).split(' ')[1] || '';
    return Number(t.slice(0, 2)) >= nowHour;
  });
  const sliceStart = startIdx >= 0 ? startIdx : 0;
  const picked = hours.slice(sliceStart, sliceStart + 24);

  return picked.map((h, i) => ({
    time: formatHourLabel(h.time, i === 0),
    temp: Math.round(h.temp_c),
    icon: httpsIcon(h.condition?.icon),
    iconEmoji: '☁️',
    condition: h.condition?.text || '',
    isNow: i === 0,
  }));
}

function buildDaily(forecastdays) {
  return (forecastdays || []).map((fd, i) => ({
    day: weekdayLabel(fd.date, i),
    high: Math.round(fd.day?.maxtemp_c ?? 0),
    low: Math.round(fd.day?.mintemp_c ?? 0),
    rain: fd.day?.daily_chance_of_rain ?? 0,
    icon: httpsIcon(fd.day?.condition?.icon),
    iconEmoji: '☀️',
    condition: fd.day?.condition?.text || '',
    date: fd.date,
  }));
}

function buildDetails(current, astro) {
  return [
    {
      label: '紫外线指数',
      value: String(current?.uv ?? '—'),
      sub: uvSub(current?.uv),
      icon: '☀️',
    },
    {
      label: '日落',
      value: astro?.sunset || '—',
      sub: `日出 ${astro?.sunrise || '—'}`,
      icon: '🌅',
    },
    {
      label: '风速',
      value: String(Math.round(current?.wind_kph ?? 0)),
      unit: 'km/h',
      sub: current?.wind_dir || '',
      icon: '💨',
    },
    {
      label: '降雨',
      value: String(current?.precip_mm ?? 0),
      unit: 'mm',
      sub: '当前累计',
      icon: '💧',
    },
    {
      label: '体感温度',
      value: String(Math.round(current?.feelslike_c ?? 0)),
      unit: '°',
      sub: '体感',
      icon: '🌡️',
    },
    {
      label: '湿度',
      value: String(current?.humidity ?? '—'),
      unit: '%',
      sub:
        current?.dewpoint_c != null
          ? `露点 ${Math.round(current.dewpoint_c)}°`
          : '',
      icon: '💦',
    },
    {
      label: '能见度',
      value: String(current?.vis_km ?? '—'),
      unit: 'km',
      sub: '能见度',
      icon: '👁️',
    },
    {
      label: '气压',
      value: String(Math.round(current?.pressure_mb ?? 0)),
      unit: 'hPa',
      sub: '气压',
      icon: '📊',
    },
  ];
}

/**
 * Map Forecast API JSON → WeatherScreen UI model
 */
export function toUiModel(forecastJson) {
  const location = forecastJson?.location || {};
  const current = forecastJson?.current || {};
  const days = forecastJson?.forecast?.forecastday || [];
  const today = days[0] || {};
  const astro = today.astro || {};

  const name = location.name || '未知';
  const region = location.region ? ` · ${location.region}` : '';

  return {
    id: location.name
      ? `${location.name}-${location.lat}-${location.lon}`
      : 'unknown',
    q: location.name || '',
    name,
    region: location.region || '',
    country: location.country || '',
    lat: location.lat,
    lon: location.lon,
    timezone: location.tz_id || '',
    date: location.localtime || '',
    lunarDate: location.country || '',
    condition: current.condition?.text || '',
    conditionIcon: httpsIcon(current.condition?.icon),
    conditionEmoji: '🌤️',
    temp: Math.round(current.temp_c ?? 0),
    high: Math.round(today.day?.maxtemp_c ?? current.temp_c ?? 0),
    low: Math.round(today.day?.mintemp_c ?? current.temp_c ?? 0),
    hourly: buildHourly(days, location.localtime),
    daily: buildDaily(days),
    details: buildDetails(current, astro),
    rawLocationLabel: `${name}${region}`,
  };
}

/**
 * Merge Current API response into existing UI model (current card + details only)
 */
export function mergeCurrent(uiModel, currentJson) {
  if (!uiModel || !currentJson) return uiModel;
  const current = currentJson.current || {};
  const location = currentJson.location || {};
  const astroFromDetails = uiModel.details?.find((d) => d.label === '日落');
  const astro = {
    sunset: astroFromDetails?.value,
    sunrise: astroFromDetails?.sub?.replace(/^日出\s*/, '') || '',
  };

  return {
    ...uiModel,
    name: location.name || uiModel.name,
    date: location.localtime || uiModel.date,
    condition: current.condition?.text || uiModel.condition,
    conditionIcon: httpsIcon(current.condition?.icon) || uiModel.conditionIcon,
    temp: Math.round(current.temp_c ?? uiModel.temp),
    details: buildDetails(current, astro),
  };
}

export { httpsIcon };

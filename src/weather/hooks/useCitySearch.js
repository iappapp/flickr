import { useEffect, useRef, useState } from 'react';
import { searchCities } from '../api/weatherApi';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_CHARS, hasApiKey } from '../config';

/**
 * Debounced city search via WeatherAPI Search / Autocomplete
 */
export function useCitySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const seq = useRef(0);

  useEffect(() => {
    const q = query.trim();
    if (q.length < SEARCH_MIN_CHARS) {
      setResults([]);
      setError(null);
      setLoading(false);
      return undefined;
    }

    if (!hasApiKey()) {
      setResults([]);
      setError('未配置 API Key，无法搜索');
      return undefined;
    }

    const id = ++seq.current;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(q);
        if (seq.current !== id) return;
        setResults(Array.isArray(data) ? data : []);
      } catch (e) {
        if (seq.current !== id) return;
        setResults([]);
        setError(e?.message || '搜索失败');
      } finally {
        if (seq.current === id) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const clear = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return { query, setQuery, results, loading, error, clear };
}

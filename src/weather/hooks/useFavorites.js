import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'weather_favorites_v1';
const LAST_QUERY_KEY = 'weather_last_query_v1';

/**
 * Persist favorite cities: [{ id, name, q }]
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [lastQuery, setLastQueryState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rawFav, rawLast] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(LAST_QUERY_KEY),
        ]);
        if (cancelled) return;
        setFavorites(rawFav ? JSON.parse(rawFav) : []);
        setLastQueryState(rawLast ? JSON.parse(rawLast) : null);
      } catch {
        if (!cancelled) {
          setFavorites([]);
          setLastQueryState(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistFavorites = useCallback(async (next) => {
    setFavorites(next);
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const setLastQuery = useCallback(async (item) => {
    setLastQueryState(item);
    try {
      await AsyncStorage.setItem(LAST_QUERY_KEY, JSON.stringify(item));
    } catch {
      // ignore
    }
  }, []);

  const addFavorite = useCallback(
    async (item) => {
      if (!item?.q) return;
      const exists = favorites.some((f) => f.q === item.q || f.id === item.id);
      if (exists) {
        const next = [
          item,
          ...favorites.filter((f) => f.q !== item.q && f.id !== item.id),
        ];
        await persistFavorites(next);
        return;
      }
      await persistFavorites([item, ...favorites].slice(0, 12));
    },
    [favorites, persistFavorites],
  );

  const removeFavorite = useCallback(
    async (qOrId) => {
      await persistFavorites(
        favorites.filter((f) => f.q !== qOrId && f.id !== qOrId),
      );
    },
    [favorites, persistFavorites],
  );

  const isFavorite = useCallback(
    (qOrId) => favorites.some((f) => f.q === qOrId || f.id === qOrId),
    [favorites],
  );

  return {
    favorites,
    lastQuery,
    ready,
    addFavorite,
    removeFavorite,
    isFavorite,
    setLastQuery,
  };
}

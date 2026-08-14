import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  Keyboard,
} from 'react-native';
import { useCitySearch } from '../weather/hooks/useCitySearch';
import { useFavorites } from '../weather/hooks/useFavorites';
import {
  searchResultToSelection,
  useWeather,
} from '../weather/hooks/useWeather';
import { DEFAULT_CITY_LABEL, DEFAULT_QUERY } from '../weather/config';

function ConditionIcon({ uri, emoji, size = 24, style }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return <Text style={[{ fontSize: size }, style]}>{emoji || '☁️'}</Text>;
  }
  return (
    <Image
      source={{ uri }}
      style={[{ width: size, height: size }, style]}
      onError={() => setFailed(true)}
    />
  );
}

export default function WeatherScreen() {
  const {
    favorites,
    lastQuery,
    ready: favoritesReady,
    addFavorite,
    removeFavorite,
    isFavorite,
    setLastQuery,
  } = useFavorites();

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!favoritesReady) return;
    if (selected) return;
    if (lastQuery?.q) {
      setSelected(lastQuery);
    } else {
      setSelected({
        id: 'beijing',
        name: DEFAULT_CITY_LABEL,
        q: DEFAULT_QUERY,
      });
    }
  }, [favoritesReady, lastQuery, selected]);

  const { city, loading, refreshing, error, usingMock, refreshCurrent, reload } =
    useWeather(selected);

  const {
    query: searchText,
    setQuery: setSearchText,
    results,
    loading: searching,
    error: searchError,
    clear: clearSearch,
  } = useCitySearch();

  const minTemp = useMemo(
    () => Math.min(...(city.daily || []).map((d) => d.low), city.low),
    [city],
  );
  const maxTemp = useMemo(
    () => Math.max(...(city.daily || []).map((d) => d.high), city.high),
    [city],
  );

  const getBgColor = (condition = '') => {
    if (condition.includes('雨') || condition.toLowerCase().includes('rain')) {
      return '#5C7A8A';
    }
    if (
      condition.includes('多云') ||
      condition.includes('阴') ||
      condition.toLowerCase().includes('cloud')
    ) {
      return '#7B9CB4';
    }
    if (condition.includes('晴') || condition.toLowerCase().includes('sun')) {
      return '#4A90D9';
    }
    return '#4A90D9';
  };

  const formatDetailValue = (detail) => {
    if (detail.unit) return `${detail.value}${detail.unit}`;
    return String(detail.value);
  };

  const chips = useMemo(() => {
    const list = [...favorites];
    if (selected && !list.some((f) => f.q === selected.q)) {
      list.unshift(selected);
    }
    if (list.length === 0) {
      list.push({ id: 'beijing', name: DEFAULT_CITY_LABEL, q: DEFAULT_QUERY });
    }
    return list;
  }, [favorites, selected]);

  const onSelectSearch = async (item) => {
    const sel = searchResultToSelection(item);
    setSelected(sel);
    await setLastQuery(sel);
    await addFavorite(sel);
    clearSearch();
    Keyboard.dismiss();
  };

  const onSelectChip = async (item) => {
    setSelected(item);
    await setLastQuery(item);
    clearSearch();
  };

  const onToggleFavorite = async () => {
    if (!selected?.q) return;
    if (isFavorite(selected.q)) {
      await removeFavorite(selected.q);
    } else {
      await addFavorite({
        id: selected.id || selected.q,
        name: city.name || selected.name,
        q: selected.q,
      });
    }
  };

  const showSearchPanel = searchText.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: getBgColor(city.condition) }]}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索城市（如 上海、London）"
          placeholderTextColor="rgba(255,255,255,0.55)"
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>清除</Text>
          </TouchableOpacity>
        )}
      </View>

      {showSearchPanel && (
        <View style={styles.searchPanel}>
          {searching && (
            <ActivityIndicator color="#fff" style={{ marginVertical: 12 }} />
          )}
          {searchError ? (
            <Text style={styles.searchHint}>{searchError}</Text>
          ) : null}
          {!searching && results.length === 0 && !searchError ? (
            <Text style={styles.searchHint}>无匹配城市</Text>
          ) : null}
          {results.map((item) => (
            <TouchableOpacity
              key={`${item.id}-${item.lat}-${item.lon}`}
              style={styles.searchItem}
              onPress={() => onSelectSearch(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.searchItemTitle}>{item.name}</Text>
              <Text style={styles.searchItemSub}>
                {[item.region, item.country].filter(Boolean).join(' · ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshCurrent}
            tintColor="#fff"
          />
        }
      >
        {/* Favorites chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityList}
          contentContainerStyle={styles.cityListContent}
        >
          {chips.map((loc) => (
            <TouchableOpacity
              key={loc.q || loc.id}
              style={[
                styles.cityItem,
                selected?.q === loc.q && styles.cityItemActive,
              ]}
              onPress={() => onSelectChip(loc)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.cityName,
                  selected?.q === loc.q && styles.cityNameActive,
                ]}
              >
                {loc.name}
              </Text>
              {isFavorite(loc.q) && <Text style={styles.favStar}>⭐</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {error ? (
          <TouchableOpacity onPress={reload} activeOpacity={0.8}>
            <Text style={styles.banner}>{error} · 点此重试</Text>
          </TouchableOpacity>
        ) : null}
        {usingMock && !error ? (
          <Text style={styles.banner}>示例数据模式</Text>
        ) : null}

        {loading && !city?.temp ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Current weather */}
            <View style={styles.currentWeather}>
              <View style={styles.titleRow}>
                <Text style={styles.cityTitle}>{city.name}</Text>
                <TouchableOpacity onPress={onToggleFavorite} hitSlop={12}>
                  <Text style={styles.favToggle}>
                    {isFavorite(selected?.q) ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.dateText}>
                {city.date}
                {city.lunarDate ? ` · ${city.lunarDate}` : ''}
              </Text>
              {loading ? (
                <ActivityIndicator color="#fff" style={{ marginVertical: 20 }} />
              ) : (
                <>
                  <Text style={styles.tempText}>{city.temp}°</Text>
                  <View style={styles.conditionRow}>
                    <ConditionIcon
                      uri={city.conditionIcon}
                      emoji={city.conditionEmoji}
                      size={32}
                    />
                    <Text style={styles.conditionText}>{city.condition}</Text>
                  </View>
                  <Text style={styles.rangeText}>
                    H:{city.high}° L:{city.low}°
                  </Text>
                </>
              )}
            </View>

            {/* Hourly */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>逐小时预报</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.hourlyRow}>
                  {(city.hourly || []).map((h, i) => (
                    <View key={i} style={styles.hourlyItem}>
                      <Text style={styles.hourlyTime}>{h.time}</Text>
                      <ConditionIcon
                        uri={h.icon}
                        emoji={h.iconEmoji}
                        size={28}
                        style={{ marginVertical: 6 }}
                      />
                      <Text style={styles.hourlyTemp}>{h.temp}°</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Daily */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {(city.daily || []).length}日预报
              </Text>
              {(city.daily || []).map((d, i) => (
                <View key={i} style={styles.dailyRow}>
                  <Text style={styles.dailyDay}>{d.day}</Text>
                  <ConditionIcon
                    uri={d.icon}
                    emoji={d.iconEmoji}
                    size={22}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.dailyRain}>
                    {d.rain > 0 ? `${d.rain}%` : ''}
                  </Text>
                  <View style={styles.tempBar}>
                    <View
                      style={[
                        styles.tempBarFill,
                        {
                          left: `${((d.low - minTemp) / (maxTemp - minTemp || 1)) * 100}%`,
                          width: `${((d.high - d.low) / (maxTemp - minTemp || 1)) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.dailyRange}>
                    {d.low}° {d.high}°
                  </Text>
                </View>
              ))}
            </View>

            {/* Details */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>详细信息</Text>
              <View style={styles.detailGrid}>
                {(city.details || []).map((detail, i) => (
                  <View key={i} style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      {detail.icon} {detail.label}
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatDetailValue(detail)}
                    </Text>
                    {detail.sub ? (
                      <Text style={styles.detailSub}>{detail.sub}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 42,
    color: '#fff',
    fontSize: 15,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearBtnText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  searchPanel: {
    marginHorizontal: 12,
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    maxHeight: 220,
    overflow: 'hidden',
  },
  searchItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  searchItemTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  searchItemSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    marginTop: 2,
  },
  searchHint: {
    color: 'rgba(255,255,255,0.75)',
    padding: 14,
    fontSize: 13,
  },
  banner: {
    marginHorizontal: 12,
    marginTop: 8,
    color: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 12,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  cityList: {
    maxHeight: 50,
    marginTop: 8,
  },
  cityListContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  cityItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityItemActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cityName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  cityNameActive: {
    color: '#fff',
    fontWeight: '600',
  },
  favStar: {
    fontSize: 12,
  },
  currentWeather: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cityTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
  },
  favToggle: {
    fontSize: 26,
    color: '#FFE566',
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  tempText: {
    fontSize: 72,
    fontWeight: '200',
    color: '#fff',
    marginTop: 10,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  conditionText: {
    fontSize: 20,
    color: '#fff',
  },
  rangeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontWeight: '500',
  },
  hourlyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hourlyItem: {
    alignItems: 'center',
    width: 56,
  },
  hourlyTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  hourlyTemp: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dailyDay: {
    width: 40,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  dailyRain: {
    width: 36,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  tempBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    marginHorizontal: 8,
    position: 'relative',
  },
  tempBarFill: {
    position: 'absolute',
    top: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 2,
  },
  dailyRange: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    width: 70,
    textAlign: 'right',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 2,
  },
  detailSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
});

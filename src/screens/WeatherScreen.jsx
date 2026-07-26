import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import locations from '../weather/locations';

export default function WeatherScreen() {
  const [selectedId, setSelectedId] = useState('nyc');
  const [favorites] = useState(['nyc', 'beijing', 'tokyo']);

  const city = useMemo(
    () => locations.find((l) => l.id === selectedId) || locations[0],
    [selectedId],
  );

  const minTemp = useMemo(
    () => Math.min(...city.daily.map((d) => d.low)),
    [city],
  );
  const maxTemp = useMemo(
    () => Math.max(...city.daily.map((d) => d.high)),
    [city],
  );

  const getBgColor = (condition) => {
    if (condition.includes('雨')) return '#5C7A8A';
    if (condition.includes('多云') || condition.includes('阴')) return '#7B9CB4';
    if (condition.includes('晴')) return '#4A90D9';
    return '#4A90D9';
  };

  const formatDetailValue = (detail) => {
    if (detail.unit) return `${detail.value}${detail.unit}`;
    return String(detail.value);
  };

  return (
    <View style={[styles.container, { backgroundColor: getBgColor(city.condition) }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* City selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityList}
          contentContainerStyle={styles.cityListContent}
        >
          {locations.map((loc) => (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.cityItem,
                selectedId === loc.id && styles.cityItemActive,
              ]}
              onPress={() => setSelectedId(loc.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.cityName,
                  selectedId === loc.id && styles.cityNameActive,
                ]}
              >
                {loc.name}
              </Text>
              {favorites.includes(loc.id) && (
                <Text style={styles.favStar}>⭐</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Current weather */}
        <View style={styles.currentWeather}>
          <Text style={styles.cityTitle}>{city.name}</Text>
          <Text style={styles.dateText}>
            {city.date} · {city.lunarDate}
          </Text>
          <Text style={styles.tempText}>{city.temp}°</Text>
          <Text style={styles.conditionText}>
            {city.conditionIcon} {city.condition}
          </Text>
          <Text style={styles.rangeText}>
            H:{city.high}° L:{city.low}°
          </Text>
        </View>

        {/* Hourly forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>24小时预报</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.hourlyRow}>
              {city.hourly.map((h, i) => (
                <View key={i} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{h.time}</Text>
                  <Text style={styles.hourlyIcon}>{h.icon}</Text>
                  <Text style={styles.hourlyTemp}>{h.temp}°</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Daily forecast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>10日预报</Text>
          {city.daily.map((d, i) => (
            <View key={i} style={styles.dailyRow}>
              <Text style={styles.dailyDay}>{d.day}</Text>
              <Text style={styles.dailyIcon}>{d.icon}</Text>
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

        {/* Detail cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>详细信息</Text>
          <View style={styles.detailGrid}>
            {city.details.map((detail, i) => (
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

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  cityTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
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
  conditionText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 4,
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
  hourlyIcon: {
    fontSize: 24,
    marginVertical: 6,
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
  dailyIcon: {
    fontSize: 18,
    marginRight: 8,
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

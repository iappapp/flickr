/**
 * Flickr — 天气 & 元素周期表（React Native Android）
 */
import React, { useState } from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import WeatherScreen from './src/screens/WeatherScreen';
import PeriodicTableScreen from './src/screens/PeriodicTableScreen';

type Screen = 'home' | 'weather' | 'periodic';

function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <View style={styles.home}>
      <Text style={styles.homeSubtitle}>选择一个功能开始</Text>
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: '#4A90D9' }]}
        activeOpacity={0.75}
        onPress={() => onNavigate('weather')}
      >
        <Text style={styles.cardIcon}>🌤️</Text>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>天气</Text>
          <Text style={styles.cardDesc}>多城市天气、24小时与10日预报</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { borderLeftColor: '#6B5B95' }]}
        activeOpacity={0.75}
        onPress={() => onNavigate('periodic')}
      >
        <Text style={styles.cardIcon}>🧪</Text>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>元素周期表</Text>
          <Text style={styles.cardDesc}>点击元素查看详细信息</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('home');

  const title =
    screen === 'weather' ? '天气' : screen === 'periodic' ? '元素周期表' : 'Flickr';

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <View style={styles.header}>
        {screen !== 'home' ? (
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 返回</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.backBtn} />
      </View>

      {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
      {screen === 'weather' && <WeatherScreen />}
      {screen === 'periodic' && <PeriodicTableScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  backBtn: {
    width: 72,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  home: {
    flex: 1,
    padding: 20,
  },
  homeSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 36,
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  cardDesc: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  arrow: {
    fontSize: 28,
    color: '#C7C7CC',
    marginLeft: 8,
  },
});

export default App;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const entries = [
  {
    key: 'Weather',
    icon: '🌤️',
    title: '天气',
    desc: '多城市天气、24小时与10日预报',
    color: '#4A90D9',
  },
  {
    key: 'PeriodicTable',
    icon: '🧪',
    title: '元素周期表',
    desc: '点击元素查看详细信息',
    color: '#6B5B95',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>选择一个功能开始</Text>
      {entries.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.card, { borderLeftColor: item.color }]}
          activeOpacity={0.75}
          onPress={() => navigation.navigate(item.key)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.textBox}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 20,
  },
  subtitle: {
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
  icon: {
    fontSize: 36,
    marginRight: 14,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  desc: {
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

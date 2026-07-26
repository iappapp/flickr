import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_W = (SCREEN_WIDTH - 12) / 18;

const elements = [
  { atomicNumber: 1, symbol: 'H', name: '氢', weight: 1.008, group: 1, period: 1, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 2, symbol: 'He', name: '氦', weight: 4.0026, group: 18, period: 1, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 3, symbol: 'Li', name: '锂', weight: 6.94, group: 1, period: 2, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 4, symbol: 'Be', name: '铍', weight: 9.0122, group: 2, period: 2, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 5, symbol: 'B', name: '硼', weight: 10.81, group: 13, period: 2, category: '类金属', color: '#98FB98' },
  { atomicNumber: 6, symbol: 'C', name: '碳', weight: 12.011, group: 14, period: 2, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 7, symbol: 'N', name: '氮', weight: 14.007, group: 15, period: 2, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 8, symbol: 'O', name: '氧', weight: 15.999, group: 16, period: 2, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 9, symbol: 'F', name: '氟', weight: 18.998, group: 17, period: 2, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 10, symbol: 'Ne', name: '氖', weight: 20.180, group: 18, period: 2, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 11, symbol: 'Na', name: '钠', weight: 22.990, group: 1, period: 3, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 12, symbol: 'Mg', name: '镁', weight: 24.305, group: 2, period: 3, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 13, symbol: 'Al', name: '铝', weight: 26.982, group: 13, period: 3, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 14, symbol: 'Si', name: '硅', weight: 28.085, group: 14, period: 3, category: '类金属', color: '#98FB98' },
  { atomicNumber: 15, symbol: 'P', name: '磷', weight: 30.974, group: 15, period: 3, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 16, symbol: 'S', name: '硫', weight: 32.06, group: 16, period: 3, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 17, symbol: 'Cl', name: '氯', weight: 35.45, group: 17, period: 3, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 18, symbol: 'Ar', name: '氩', weight: 39.948, group: 18, period: 3, category: '惰性气体', color: '#D3D3D3' },
  { atomicNumber: 19, symbol: 'K', name: '钾', weight: 39.098, group: 1, period: 4, category: '碱金属', color: '#FFB6C1' },
  { atomicNumber: 20, symbol: 'Ca', name: '钙', weight: 40.078, group: 2, period: 4, category: '碱土金属', color: '#FFA07A' },
  { atomicNumber: 21, symbol: 'Sc', name: '钪', weight: 44.956, group: 3, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 22, symbol: 'Ti', name: '钛', weight: 47.867, group: 4, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 23, symbol: 'V', name: '钒', weight: 50.942, group: 5, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 24, symbol: 'Cr', name: '铬', weight: 51.996, group: 6, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 25, symbol: 'Mn', name: '锰', weight: 54.938, group: 7, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 26, symbol: 'Fe', name: '铁', weight: 55.845, group: 8, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 27, symbol: 'Co', name: '钴', weight: 58.933, group: 9, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 28, symbol: 'Ni', name: '镍', weight: 58.693, group: 10, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 29, symbol: 'Cu', name: '铜', weight: 63.546, group: 11, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 30, symbol: 'Zn', name: '锌', weight: 65.38, group: 12, period: 4, category: '过渡金属', color: '#E6E6FA' },
  { atomicNumber: 31, symbol: 'Ga', name: '镓', weight: 69.723, group: 13, period: 4, category: '贫金属', color: '#F0E68C' },
  { atomicNumber: 32, symbol: 'Ge', name: '锗', weight: 72.630, group: 14, period: 4, category: '类金属', color: '#98FB98' },
  { atomicNumber: 33, symbol: 'As', name: '砷', weight: 74.922, group: 15, period: 4, category: '类金属', color: '#98FB98' },
  { atomicNumber: 34, symbol: 'Se', name: '硒', weight: 78.971, group: 16, period: 4, category: '非金属', color: '#FFCCCB' },
  { atomicNumber: 35, symbol: 'Br', name: '溴', weight: 79.904, group: 17, period: 4, category: '卤素', color: '#87CEEB' },
  { atomicNumber: 36, symbol: 'Kr', name: '氪', weight: 83.798, group: 18, period: 4, category: '惰性气体', color: '#D3D3D3' },
  // Lanthanides
  { atomicNumber: 58, symbol: 'Ce', name: '铈', weight: 140.12, group: 4, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 59, symbol: 'Pr', name: '镨', weight: 140.91, group: 5, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 60, symbol: 'Nd', name: '钕', weight: 144.24, group: 6, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 61, symbol: 'Pm', name: '钷', weight: 145, group: 7, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 62, symbol: 'Sm', name: '钐', weight: 150.36, group: 8, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 63, symbol: 'Eu', name: '铕', weight: 151.96, group: 9, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 64, symbol: 'Gd', name: '钆', weight: 157.25, group: 10, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 65, symbol: 'Tb', name: '铽', weight: 158.93, group: 11, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 66, symbol: 'Dy', name: '镝', weight: 162.50, group: 12, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 67, symbol: 'Ho', name: '钬', weight: 164.93, group: 13, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 68, symbol: 'Er', name: '铒', weight: 167.26, group: 14, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 69, symbol: 'Tm', name: '铥', weight: 168.93, group: 15, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 70, symbol: 'Yb', name: '镱', weight: 173.05, group: 16, period: 8, category: '镧系', color: '#DDA0DD' },
  { atomicNumber: 71, symbol: 'Lu', name: '镥', weight: 174.97, group: 17, period: 8, category: '镧系', color: '#DDA0DD' },
  // Actinides
  { atomicNumber: 90, symbol: 'Th', name: '钍', weight: 232.04, group: 4, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 91, symbol: 'Pa', name: '镤', weight: 231.04, group: 5, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 92, symbol: 'U', name: '铀', weight: 238.03, group: 6, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 93, symbol: 'Np', name: '镎', weight: 237, group: 7, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 94, symbol: 'Pu', name: '钚', weight: 244, group: 8, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 95, symbol: 'Am', name: '镅', weight: 243, group: 9, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 96, symbol: 'Cm', name: '锔', weight: 247, group: 10, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 97, symbol: 'Bk', name: '锫', weight: 247, group: 11, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 98, symbol: 'Cf', name: '锎', weight: 251, group: 12, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 99, symbol: 'Es', name: '锿', weight: 252, group: 13, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 100, symbol: 'Fm', name: '镄', weight: 257, group: 14, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 101, symbol: 'Md', name: '钔', weight: 258, group: 15, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 102, symbol: 'No', name: '锘', weight: 259, group: 16, period: 9, category: '锕系', color: '#F0D0D0' },
  { atomicNumber: 103, symbol: 'Lr', name: '铹', weight: 262, group: 17, period: 9, category: '锕系', color: '#F0D0D0' },
];

const legendItems = [
  { color: '#FFB6C1', label: '碱金属' },
  { color: '#FFA07A', label: '碱土金属' },
  { color: '#E6E6FA', label: '过渡金属' },
  { color: '#DDA0DD', label: '镧系' },
  { color: '#F0D0D0', label: '锕系' },
  { color: '#F0E68C', label: '贫金属' },
  { color: '#98FB98', label: '类金属' },
  { color: '#FFCCCB', label: '非金属' },
  { color: '#87CEEB', label: '卤素' },
  { color: '#D3D3D3', label: '惰性气体' },
];

function createPeriodicTable() {
  const table = Array(10).fill(null).map(() => Array(18).fill(null));

  elements.forEach((element) => {
    let row = element.period - 1;
    let col = element.group - 1;

    if (element.category === '镧系') {
      row = 8;
      col = element.atomicNumber - 54;
    } else if (element.category === '锕系') {
      row = 9;
      col = element.atomicNumber - 86;
    }

    if (element.period === 1) {
      if (element.atomicNumber === 1) col = 0;
      else if (element.atomicNumber === 2) col = 17;
    }

    if (row >= 0 && row < 10 && col >= 0 && col < 18) {
      table[row][col] = element;
    }
  });

  return table;
}

const periodicTable = createPeriodicTable();

export default function PeriodicTableScreen() {
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {periodicTable.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((element, colIndex) => (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    style={styles.cell}
                    activeOpacity={element ? 0.6 : 1}
                    onPress={() => element && setSelectedElement(element)}
                  >
                    {element && (
                      <View
                        style={[
                          styles.elementBox,
                          { backgroundColor: element.color },
                          selectedElement?.atomicNumber === element.atomicNumber && styles.selected,
                        ]}
                      >
                        <Text style={styles.atomicNumber}>{element.atomicNumber}</Text>
                        <Text style={styles.symbol}>{element.symbol}</Text>
                        <Text style={styles.name}>{element.name}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.legend}>
            <Text style={styles.legendTitle}>元素分类</Text>
            <View style={styles.legendGrid}>
              {legendItems.map((item, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={!!selectedElement}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedElement(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedElement(null)}
        >
          <View style={styles.modalContent}>
            {selectedElement && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedElement.name} ({selectedElement.symbol})
                </Text>
                <View style={styles.detailGrid}>
                  <DetailRow label="原子序数" value={String(selectedElement.atomicNumber)} />
                  <DetailRow label="原子量" value={String(selectedElement.weight)} />
                  <DetailRow label="周期" value={String(selectedElement.period)} />
                  <DetailRow label="族" value={String(selectedElement.group)} />
                  <DetailRow label="分类" value={selectedElement.category} />
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedElement(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeBtnText}>关闭</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  tableContainer: {
    padding: 6,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_W,
    height: CELL_W + 8,
    padding: 1,
  },
  elementBox: {
    flex: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  atomicNumber: {
    fontSize: 7,
    color: '#333',
    fontWeight: '600',
  },
  symbol: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  name: {
    fontSize: 7,
    color: '#555',
  },
  legend: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 13,
    color: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: SCREEN_WIDTH - 60,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  detailGrid: {
    width: '100%',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
